import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { modernColors } from '../../theme/modernTheme';
import { formatDate } from '../../utils/validation';
import { discountedAmount } from '../../utils/price';
import { Exam, ExamDate, ExamName, FormData, Region } from '../../types';

interface SelectionPanelProps {
  formData: Partial<FormData>;
  examNames: ExamName[];
  regions: Region[];
  exams: Exam[];
  examDates: ExamDate[];
  onChange?: () => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  formData,
  examNames,
  regions,
  exams,
  examDates,
  onChange,
}) => {
  const { t } = useTranslation();

  const exam = exams.find((e) => e.id === formData.exam);
  const examDate = examDates.find((ed) => ed.id === formData.examDate);
  const original = exam ? parseFloat(exam.amount) : null;
  const final = original === null ? null : discountedAmount(original, formData.promocodeData);

  const rows = [
    { label: t('exam_selection.exam_name'), value: examNames.find((en) => en.id === formData.examName)?.name },
    { label: t('exam_selection.exam'), value: exam?.name },
    { label: t('exam_selection.region'), value: regions.find((r) => r.id === formData.region)?.name },
    { label: t('exam_selection.exam_date'), value: examDate ? formatDate(examDate.date) : undefined },
  ].filter((row) => row.value);

  return (
    <Box
      component="aside"
      sx={{
        flex: '1 1 320px',
        minWidth: 0,
        boxSizing: 'border-box',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: modernColors.surface.primary,
        border: `1px solid ${modernColors.gray[200]}`,
        borderRadius: '16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography component="h2" sx={{ fontSize: '18px', fontWeight: 700 }}>
          {t('exam_selection.your_choice')}
        </Typography>
        {onChange && (
          <Link component="button" type="button" onClick={onChange} sx={{ fontSize: '14px', fontWeight: 600 }}>
            {t('exam_selection.change')}
          </Link>
        )}
      </Box>

      {rows.length === 0 && (
        <Typography sx={{ fontSize: '14px', color: modernColors.gray[600] }}>
          {t('exam_selection.your_choice_empty')}
        </Typography>
      )}

      {rows.map((row) => (
        <Box key={row.label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: '13px', color: modernColors.gray[600] }}>{row.label}</Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 600, overflowWrap: 'anywhere' }}>{row.value}</Typography>
        </Box>
      ))}

      {final !== null && (
        <Box sx={{ pt: 2, borderTop: `1px solid ${modernColors.gray[200]}`, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: '13px', color: modernColors.gray[600] }}>
            {t('exam_selection.amount')}
          </Typography>
          {original !== null && final < original && (
            <Typography sx={{ fontSize: '14px', color: modernColors.gray[600], textDecoration: 'line-through' }}>
              {original.toLocaleString('ru-RU')} so'm
            </Typography>
          )}
          <Typography sx={{ fontSize: '24px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {final.toLocaleString('ru-RU')} so'm
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SelectionPanel;
