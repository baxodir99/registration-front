import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PaymentResponse } from '../../types';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { NavRow, Notice, SecondaryButton, SectionCard, StepLayout, SupportLine } from '../ui';
import InvoiceSummary, { PaymentDetails } from './InvoiceSummary';

interface AcceptedStepProps extends PaymentDetails {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onNewRegistration: () => void;
  finishLabel?: string;
}

/**
 * Ochadigan to'lov sahifasi yo'q: bepul ariza yoki billing havola qaytarmagan.
 * Hech qayerga yo'naltirmaydi — ariza qabul qilinganini aytadi va kabinetga yuboradi
 * (kirilmagan bo'lsa /kabinet o'zi /kirish ga o'tkazadi).
 */
const AcceptedStep: React.FC<AcceptedStepProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onNewRegistration,
  finishLabel,
  ...details
}) => {
  const { t } = useTranslation();
  const free = paymentData.pay_method === 'free';

  return (
    <StepLayout
      aside={<InvoiceSummary paymentData={paymentData} originalAmount={originalAmount} hasDiscount={hasDiscount} {...details} />}
    >
      <SectionCard sx={{ p: { xs: 2, sm: 4 }, gap: 2.75 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.25, alignItems: 'flex-start' }}>
          <Box sx={{ width: 56, height: 56, flex: '0 0 56px', borderRadius: '28px', backgroundColor: statusColors.success.bg, color: statusColors.success.dot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box sx={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography component="h1" sx={{ m: 0, fontSize: { xs: '22px', sm: '26px' }, fontWeight: 700 }}>
              {t('payment.accepted.title')}
            </Typography>
            <Typography sx={{ m: 0, fontSize: '15px', lineHeight: 1.55, color: modernColors.gray[700] }}>
              {free ? t('payment.accepted.free_lead') : t('payment.accepted.no_link_lead')}
            </Typography>
          </Box>
        </Box>

        {!free && paymentData.invoice && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1, p: '12px 16px', borderRadius: '10px', backgroundColor: modernColors.gray[50], border: `1px solid ${modernColors.gray[200]}` }}>
            <Box component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>{t('payment.accepted.invoice_number')}</Box>
            <Box component="span" sx={{ fontSize: '15px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{paymentData.invoice}</Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            component={RouterLink}
            to="/kabinet"
            variant="contained"
            disableElevation
            sx={{ minHeight: 54, borderRadius: '12px', fontSize: '16px', fontWeight: 600, textTransform: 'none' }}
          >
            {t('payment.accepted.to_cabinet')}
          </Button>
          <Typography sx={{ m: 0, fontSize: '13px', textAlign: 'center', color: modernColors.gray[500] }}>
            {t('payment.accepted.cabinet_hint')}
          </Typography>
        </Box>

        {!free && <Notice>{t('payment.accepted.no_link_note')}</Notice>}
      </SectionCard>

      <NavRow>
        <SecondaryButton onClick={onNewRegistration} sx={{ minHeight: 48, fontSize: '15px' }}>
          {finishLabel || t('payment.new_registration')}
        </SecondaryButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SupportLine />
        </Box>
      </NavRow>
    </StepLayout>
  );
};

export default AcceptedStep;
