import React, { useState } from 'react';
import { Box, Button, Checkbox, IconButton, Typography } from '@mui/material';
import { Download as DownloadIcon, Lock as LockIcon, OpenInNew as OpenIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PROMOCODE_ENABLED } from '../constants';
import { apiService } from '../services/api';
import { formatDate } from '../utils/validation';
import { discountedAmount, formatMoney } from '../utils/price';
import { regionName } from '../utils/regions';
import { modernColors, statusColors } from '../theme/modernTheme';
import { Exam, ExamDate, ExamName, FormData, FormStep, Region, Type } from '../types';
import {
  AsideCard,
  CardTitle,
  Divider,
  InfoItem,
  NavRow,
  Notice,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  StepLayout,
  SummaryRow,
  TextLink,
  TotalRow,
} from './ui';

interface ConfirmationStepProps {
  formData: FormData;
  types: Type[];
  regions: Region[];
  examNames: ExamName[];
  exams: Exam[];
  examDates: ExamDate[];
  onNext: (data: { paymentData: any }) => void;
  onPrevious: () => void;
  onEdit: (step: FormStep) => void;
}

const formatPhoneLabel = (phone?: string) =>
  (phone || '').replace(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4');

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  types,
  regions,
  examNames,
  exams,
  examDates,
  onNext,
  onPrevious,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(formData.terms_accepted || false);

  const region = regions.find((r) => r.id === formData.region);
  const examName = examNames.find((en) => en.id === formData.examName);
  const exam = exams.find((e) => e.id === formData.exam);
  const type = types.find((item) => item.id === exam?.type);
  const examDate = examDates.find((ed) => ed.id === formData.examDate);
  const profile = formData.userProfile;
  const offerLink = examName?.offer;

  const original = exam ? parseFloat(exam.amount) : 0;
  const final = discountedAmount(original, formData.promocodeData);
  const currency = t('payment.currency');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createInvoice({
        pnfl: formData.pnfl,
        examdate: formData.examDate!,
        phone: formData.phone!,
        email: formData.email!,
        region: formData.region!,
        terms_accepted: termsAccepted,
        promocode: formData.promocode || undefined,
      });
      if (response.status === 1) {
        onNext({ paymentData: response.data });
      } else {
        setError(response.message || t('messages.registration_failed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  const cardHeader = (title: string, step: FormStep) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
      <CardTitle size={18}>{title}</CardTitle>
      <TextLink onClick={() => onEdit(step)}>{t('confirmation.edit')}</TextLink>
    </Box>
  );
  const threeColumns = { display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 };
  const cardSx = { px: { xs: 2, sm: 3.5 }, py: { xs: 2, sm: 3 }, gap: 2 };

  const aside = (
    <AsideCard>
      <CardTitle size={18}>{t('confirmation.payment_amount')}</CardTitle>
      {final < original && (
        <>
          <SummaryRow
            label={t('confirmation.original_amount')}
            value={<Box component="span" sx={{ color: modernColors.gray[600], textDecoration: 'line-through' }}>{formatMoney(original)} {currency}</Box>}
          />
          <SummaryRow
            label={<>{t('confirmation.discount_promo')} <Box component="strong" sx={{ color: modernColors.gray[900] }}>{formData.promocode}</Box></>}
            value={<Box component="span" sx={{ color: statusColors.success.text, fontWeight: 600 }}>−{formatMoney(original - final)} {currency}</Box>}
          />
          <Divider />
        </>
      )}
      <TotalRow label={t('confirmation.final_amount')} value={`${formatMoney(final)} ${currency}`} />
      {PROMOCODE_ENABLED && (
        <Typography sx={{ m: 0, fontSize: '13px', lineHeight: 1.5, color: modernColors.gray[500] }}>
          {t('confirmation.promo_hint')}
        </Typography>
      )}
    </AsideCard>
  );

  return (
    <StepLayout aside={aside} gap={2}>
      <PageTitle size={28} title={t('confirmation.title')} subtitle={t('confirmation.subtitle')} />

      {error && <Notice kind="error">{error}</Notice>}

      <SectionCard sx={cardSx}>
        {cardHeader(t('confirmation.exam_info'), FormStep.EXAM_SELECTION)}
        <Box sx={threeColumns}>
          <InfoItem strong label={t('confirmation.field_name')} value={examName?.name} />
          <InfoItem label={t('confirmation.field_direction')} value={exam?.name} />
          {type && <InfoItem label={t('confirmation.field_type')} value={type.name} />}
          <InfoItem label={t('confirmation.field_region')} value={regionName(t, region?.name)} />
          <InfoItem label={t('confirmation.field_date')} value={examDate ? formatDate(examDate.date) : undefined} />
        </Box>
      </SectionCard>

      <SectionCard sx={cardSx}>
        {cardHeader(t('confirmation.personal_info'), FormStep.PERSONALIZATION)}
        <Box sx={threeColumns}>
          <InfoItem strong sx={{ gridColumn: '1 / -1' }} label={t('user_info.full_name')} value={profile?.full_name} />
          <InfoItem label={t('confirmation.field_pnfl')} value={formData.pnfl || profile?.pnfl_masked} />
          <InfoItem label={t('confirmation.field_passport')} value={profile?.passport} />
          <InfoItem label={t('user_info.birth_date')} value={profile ? formatDate(profile.birth_date) : undefined} />
          <InfoItem label={t('user_info.nationality')} value={profile?.nationality} />
        </Box>
      </SectionCard>

      <SectionCard sx={cardSx}>
        {cardHeader(t('confirmation.contact_info'), FormStep.PERSONALIZATION)}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
          <InfoItem label={t('confirmation.field_phone')} value={formatPhoneLabel(formData.phone)} />
          <InfoItem label={t('confirmation.field_email')} value={formData.email} />
        </Box>
      </SectionCard>

      <SectionCard sx={{ ...cardSx, gap: 1.75 }}>
        <CardTitle size={18}>{t('registration_details.offer')}</CardTitle>
        {offerLink ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1.75,
              p: '14px 16px',
              borderRadius: '12px',
              border: `1px solid ${modernColors.gray[200]}`,
              backgroundColor: '#F8FAF9',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 48,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${modernColors.gray[200]}`,
                color: statusColors.error.dot,
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              PDF
            </Box>
            <Box sx={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Box component="span" sx={{ fontSize: '15px', fontWeight: 600 }}>
                {t('confirmation.offer_name', { name: examName?.name })}
              </Box>
              <Box component="span" sx={{ fontSize: '13px', color: modernColors.gray[600] }}>
                {t('confirmation.offer_sub')}
              </Box>
            </Box>
            <Button
              variant="outlined"
              href={offerLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenIcon />}
              sx={{ minHeight: 44, py: 0, px: 1.75, borderRadius: '10px', fontWeight: 600, color: modernColors.gray[900], borderColor: modernColors.gray[300] }}
            >
              {t('confirmation.offer_open')}
            </Button>
            <IconButton
              href={offerLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('registration_details.offer_download')}
              sx={{ width: 44, height: 44, borderRadius: '10px', border: `1px solid ${modernColors.gray[300]}`, color: modernColors.gray[900] }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Notice>{t('registration_details.offer_missing')}</Notice>
        )}
        <Box
          component="label"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            p: '14px 16px',
            borderRadius: '12px',
            border: termsAccepted ? `2px solid ${modernColors.primary[600]}` : `1px solid ${modernColors.gray[300]}`,
            backgroundColor: termsAccepted ? modernColors.primary[50] : '#FFFFFF',
            fontSize: '15px',
            lineHeight: 1.45,
            cursor: 'pointer',
          }}
        >
          <Checkbox
            name="terms_accepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            sx={{ p: 0 }}
          />
          <span>{t('confirmation.terms')}</span>
        </Box>
        {!termsAccepted && (
          <Typography component="span" sx={{ fontSize: '13px', color: modernColors.gray[500] }}>
            {t('confirmation.terms_hint')}
          </Typography>
        )}
      </SectionCard>

      <NavRow>
        <SecondaryButton onClick={onPrevious} disabled={loading}>← {t('common.previous')}</SecondaryButton>
        <PrimaryButton onClick={handleConfirm} loading={loading} disabled={!termsAccepted} startIcon={loading ? undefined : <LockIcon />}>
          {t('confirmation.confirm_registration')}
        </PrimaryButton>
      </NavRow>
    </StepLayout>
  );
};

export default ConfirmationStep;
