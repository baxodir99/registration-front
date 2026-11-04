import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { examSelectionSchema } from '../utils/validation';
import { dayMonth, longDate } from '../utils/dates';
import { discountedAmount, formatMoney } from '../utils/price';
import { modernColors, statusColors } from '../theme/modernTheme';
import { Exam, ExamDate, ExamName, FormData, PromoCode, Region } from '../types';
import ExamCalendar, { dateStatus } from './ExamCalendar';
import {
  AsideCard,
  CardTitle,
  Divider,
  FieldHint,
  FieldLabel,
  InfoItem,
  inputSx,
  PrimaryButton,
  SectionCard,
  StepLayout,
} from './ui';

interface ExamSelectionStepProps {
  initialData?: Partial<FormData>;
  onNext: (data: Partial<FormData>) => void;
  onDataChange: (data: Partial<FormData>) => void;
  examNames: ExamName[];
  regions: Region[];
}

const PROMO_DEBOUNCE = 500;

const ExamSelectionStep: React.FC<ExamSelectionStepProps> = ({
  initialData,
  onNext,
  onDataChange,
  examNames,
  regions,
}) => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [exams, setExams] = useState<Exam[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(dayjs().startOf('month'));

  const [promocodeInput, setPromocodeInput] = useState(initialData?.promocode || '');
  const [promocodeData, setPromocodeData] = useState<PromoCode | null>(initialData?.promocodeData || null);
  const [promocodeLoading, setPromocodeLoading] = useState(false);
  const [promocodeError, setPromocodeError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formik = useFormik({
    initialValues: {
      examName: initialData?.examName || '',
      region: initialData?.region || '',
      exam: initialData?.exam || '',
      examDate: initialData?.examDate || '',
    },
    validationSchema: examSelectionSchema,
    onSubmit: (values) => {
      onNext({
        examName: Number(values.examName),
        region: Number(values.region),
        exam: Number(values.exam),
        examDate: Number(values.examDate),
        promocode: promocodeData ? promocodeInput : undefined,
        promocodeData: promocodeData || undefined,
      });
    },
  });
  const { examName, region, exam, examDate } = formik.values;

  useEffect(() => {
    onDataChange({
      examName: examName ? Number(examName) : undefined,
      region: region ? Number(region) : undefined,
      exam: exam ? Number(exam) : undefined,
      examDate: examDate ? Number(examDate) : undefined,
      promocode: promocodeData ? promocodeInput : undefined,
      promocodeData: promocodeData || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examName, region, exam, examDate, promocodeInput, promocodeData]);

  useEffect(() => {
    if (!examName) {
      setExams([]);
      return;
    }
    let stale = false;
    setError(null);
    apiService
      .getExams({ examname: Number(examName) })
      .then((data) => {
        if (stale) return;
        setExams(data);
        if (data.length === 1) {
          formik.setFieldValue('exam', data[0].id);
        } else if (exam && !data.some((e) => e.id === Number(exam))) {
          formik.setFieldValue('exam', '');
          formik.setFieldValue('examDate', '');
        }
      })
      .catch(() => {
        if (!stale) setError(t('common.error'));
      });
    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examName]);

  useEffect(() => {
    if (!exam || !region) {
      setExamDates([]);
      return;
    }
    let stale = false;
    setDatesLoading(true);
    setError(null);
    apiService
      .getExamDates({ exam: Number(exam), region: Number(region) })
      .then((data) => {
        if (stale) return;
        setExamDates(data);
        const selected = data.find((d) => d.id === Number(examDate));
        if (selected) {
          setMonth(dayjs(selected.date).startOf('month'));
        } else {
          setMonth(dayjs().startOf('month'));
          if (examDate) formik.setFieldValue('examDate', '');
        }
      })
      .catch(() => {
        if (!stale) {
          setExamDates([]);
          setError(t('common.error'));
        }
      })
      .finally(() => {
        if (!stale) setDatesLoading(false);
      });
    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, region]);

  const pickExamName = (id: number) => {
    if (id === Number(examName)) return;
    formik.setValues({ examName: id, region, exam: '', examDate: '' });
  };

  const checkPromocode = async (code: string) => {
    if (code.trim().length < 3) {
      setPromocodeData(null);
      setPromocodeError(null);
      return;
    }
    try {
      setPromocodeLoading(true);
      setPromocodeError(null);
      const response = await apiService.checkPromocode(code.trim());
      if (response.status === 1 && response.data) {
        setPromocodeData(response.data);
      } else {
        setPromocodeError(response.message || t('confirmation.promocode_invalid'));
        setPromocodeData(null);
      }
    } catch (err: any) {
      setPromocodeError(err.response?.data?.message || t('confirmation.promocode_invalid'));
      setPromocodeData(null);
    } finally {
      setPromocodeLoading(false);
    }
  };

  const handlePromocodeChange = (value: string) => {
    const code = value.toUpperCase();
    setPromocodeInput(code);
    setPromocodeData(null);
    setPromocodeError(null);
    if (debounce.current) clearTimeout(debounce.current);
    if (code.trim()) {
      debounce.current = setTimeout(() => checkPromocode(code), PROMO_DEBOUNCE);
    }
  };

  useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current);
    },
    []
  );

  const selectedExamName = examNames.find((e) => e.id === Number(examName));
  const selectedExam = exams.find((e) => e.id === Number(exam));
  const selectedRegion = regions.find((r) => r.id === Number(region));
  const selectedDate = examDates.find((d) => d.id === Number(examDate));
  const original = selectedExam ? parseFloat(selectedExam.amount) : 0;
  const final = discountedAmount(original, promocodeData);
  const currency = t('payment.currency');
  const canContinue = Boolean(selectedExam && selectedRegion && selectedDate && dateStatus(selectedDate) !== 'full');
  const percent = selectedDate?.capacity ? Math.min((selectedDate.booked / selectedDate.capacity) * 100, 100) : 0;

  const aside = (
    <AsideCard gap={2.25}>
      {!isMobile && (
        <>
          <CardTitle size={18}>{t('exam_selection.your_choice')}</CardTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <InfoItem strong label={t('exam_selection.summary_exam')} value={selectedExamName?.name || t('exam_selection.not_selected')} />
            <InfoItem label={t('exam_selection.summary_direction')} value={selectedExam?.name || t('exam_selection.not_selected')} />
            <InfoItem label={t('exam_selection.summary_region')} value={selectedRegion?.name || t('exam_selection.not_selected')} />
            <InfoItem
              label={t('exam_selection.summary_date')}
              value={selectedDate ? longDate(selectedDate.date, i18n.language) : t('exam_selection.not_selected')}
            />
          </Box>
          {selectedDate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: modernColors.gray[700] }}>
                <span>{t('exam_selection.occupancy')}</span>
                <Box component="span" sx={{ fontWeight: 600, color: modernColors.gray[900] }}>
                  {selectedDate.booked} / {selectedDate.capacity}
                </Box>
              </Box>
              <Box sx={{ height: 6, borderRadius: '3px', backgroundColor: modernColors.gray[100], overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${percent}%`,
                    height: 6,
                    backgroundColor: dateStatus(selectedDate) === 'half' ? statusColors.warning.dot : statusColors.success.dot,
                  }}
                />
              </Box>
            </Box>
          )}
          <Divider />
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <FieldLabel htmlFor="promo">
          {t('confirmation.promocode')}{' '}
          <Box component="span" sx={{ fontWeight: 400, color: modernColors.gray[500] }}>
            {t('exam_selection.promo_optional')}
          </Box>
        </FieldLabel>
        <OutlinedInput
          id="promo"
          value={promocodeInput}
          onChange={(e) => handlePromocodeChange(e.target.value)}
          placeholder={t('confirmation.promocode_placeholder')}
          error={Boolean(promocodeError)}
          inputProps={{ style: { textTransform: 'uppercase' } }}
          sx={{ ...(inputSx as object), minHeight: 44 }}
          endAdornment={
            <InputAdornment position="end">
              {promocodeLoading && <CircularProgress size={18} />}
              {!promocodeLoading && promocodeInput && (
                <IconButton size="small" aria-label={t('confirmation.remove_promocode')} onClick={() => handlePromocodeChange('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          }
        />
        {promocodeError && <FieldHint error>{promocodeError}</FieldHint>}
        {promocodeData && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '12px', fontWeight: 600, color: statusColors.success.text }}>
            <CheckIcon sx={{ fontSize: 16 }} />
            {t('confirmation.promocode_applied')}
          </Box>
        )}
      </Box>

      {isMobile && selectedExam && selectedDate && (
        <Box sx={{ fontSize: '13px', color: modernColors.gray[600] }}>
          {selectedExam.name} · {dayMonth(selectedDate.date, i18n.language)}
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
        <Typography component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>
          {t('exam_selection.total')}
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          {final < original && (
            <Box sx={{ fontSize: '13px', color: modernColors.gray[500], textDecoration: 'line-through' }}>
              {formatMoney(original)} {currency}
            </Box>
          )}
          <Typography component="span" sx={{ fontSize: '20px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {selectedExam ? `${formatMoney(final)} ${currency}` : '—'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <PrimaryButton fullWidth disabled={!canContinue} onClick={() => formik.submitForm()}>
          {t('common.continue')} →
        </PrimaryButton>
        {!canContinue && (
          <Typography sx={{ m: 0, fontSize: '13px', color: modernColors.gray[600], textAlign: 'center' }}>
            {t('exam_selection.choose_date_hint')}
          </Typography>
        )}
      </Box>
      {!isMobile && (
        <Typography sx={{ m: 0, fontSize: '12px', lineHeight: 1.5, color: modernColors.gray[500] }}>
          {t('exam_selection.saved_note')}
        </Typography>
      )}
    </AsideCard>
  );

  return (
    <StepLayout aside={aside}>
      {error && (
        <Box role="alert" sx={{ p: '12px 14px', borderRadius: '10px', backgroundColor: statusColors.error.bg, color: statusColors.error.text, fontSize: '14px' }}>
          {error}
        </Box>
      )}

      <SectionCard>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <CardTitle>{isMobile ? t('exam_selection.pick_exam_short') : t('exam_selection.pick_exam_title')}</CardTitle>
          {!isMobile && (
            <Typography sx={{ m: 0, fontSize: '14px', color: modernColors.gray[600] }}>
              {t('exam_selection.pick_exam_sub')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 1.25, sm: 1.5 } }}>
          {examNames.map((item) => {
            const selected = item.id === Number(examName);
            return (
              <Button
                key={item.id}
                onClick={() => pickExamName(item.id)}
                aria-pressed={selected}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  gap: 1.5,
                  minHeight: { xs: 56, sm: 76 },
                  px: 2.25,
                  py: 1.75,
                  borderRadius: '12px',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: modernColors.gray[900],
                  border: selected ? `2px solid ${modernColors.primary[600]}` : `1px solid ${modernColors.gray[300]}`,
                  backgroundColor: selected ? modernColors.primary[50] : '#FFFFFF',
                  '&:hover': { backgroundColor: modernColors.primary[50] },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    flex: '0 0 20px',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    border: selected ? 0 : `2px solid ${modernColors.gray[400]}`,
                    backgroundColor: selected ? modernColors.primary[600] : 'transparent',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selected && <CheckIcon sx={{ fontSize: 14 }} />}
                </Box>
                {item.name}
              </Button>
            );
          })}
        </Box>
      </SectionCard>

      <SectionCard>
        <CardTitle>{isMobile ? t('exam_selection.place_short') : t('exam_selection.place_title')}</CardTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="region">{t('exam_selection.region')}</FieldLabel>
            <Select
              id="region"
              name="region"
              displayEmpty
              value={region}
              onChange={formik.handleChange}
              inputProps={{ 'aria-label': t('exam_selection.region') }}
              sx={inputSx}
            >
              <MenuItem value="" disabled>{t('exam_selection.region_placeholder')}</MenuItem>
              {regions.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="exam">{t('exam_selection.exam')}</FieldLabel>
            <Select
              id="exam"
              name="exam"
              displayEmpty
              value={exams.some((e) => e.id === Number(exam)) ? exam : ''}
              onChange={formik.handleChange}
              disabled={!examName}
              inputProps={{ 'aria-label': t('exam_selection.exam') }}
              sx={inputSx}
            >
              <MenuItem value="" disabled>{t('exam_selection.exam_placeholder')}</MenuItem>
              {exams.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </SectionCard>

      <ExamCalendar
        examDates={examDates}
        selectedId={examDate ? Number(examDate) : undefined}
        ready={Boolean(exam && region)}
        loading={datesLoading}
        month={month}
        onMonthChange={setMonth}
        onSelect={(picked) => formik.setFieldValue('examDate', picked.id)}
      />
    </StepLayout>
  );
};

export default ExamSelectionStep;
