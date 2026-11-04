import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  Check as CheckIcon,
  CheckCircleOutline as OpenedIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PaymentResponse } from '../../types';
import { formatMoney } from '../../utils/price';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { CardTitle, NavRow, Notice, PrimaryButton, SecondaryButton, SectionCard, StepLayout, SupportLine } from '../ui';
import InvoiceSummary, { PaymentDetails } from './InvoiceSummary';

interface CheckoutRedirectStepProps extends PaymentDetails {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onNewRegistration: () => void;
  finishLabel?: string;
}

const CheckoutRedirectStep: React.FC<CheckoutRedirectStepProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onNewRegistration,
  finishLabel,
  ...details
}) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const openPaymentPage = () => {
    if (!paymentData.pay_url) return;
    window.open(paymentData.pay_url, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  const afterSteps = [t('payment.redirect.after_1'), t('payment.redirect.after_2'), t('payment.redirect.after_3')];

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
              {t('payment.redirect.title')}
            </Typography>
            <Typography sx={{ m: 0, fontSize: '15px', lineHeight: 1.55, color: modernColors.gray[700] }}>
              {t('payment.redirect.lead_before')} <strong>{t('payment.redirect.lead_strong')}</strong> {t('payment.redirect.lead_after')}
            </Typography>
          </Box>
        </Box>

        {!opened ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <PrimaryButton tall fullWidth onClick={openPaymentPage} endIcon={<OpenIcon />} sx={{ minHeight: 58 }}>
              {t('payment.redirect.pay_amount', { amount: formatMoney(paymentData.amount), currency: t('payment.currency') })}
            </PrimaryButton>
            <Typography sx={{ m: 0, fontSize: '13px', textAlign: 'center', color: modernColors.gray[500] }}>
              {t('payment.redirect.secure_hint')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, p: 2.25, borderRadius: '14px', backgroundColor: statusColors.info.bg, border: `1px solid ${statusColors.info.border}`, color: statusColors.info.text }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: '15px', fontWeight: 600 }}>
              <OpenedIcon sx={{ fontSize: 20 }} />
              {t('payment.redirect.opened_title')}
            </Box>
            <Typography component="span" sx={{ fontSize: '14px', lineHeight: 1.5 }}>
              {t('payment.redirect.opened_note')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
              <Button component={RouterLink} to="/kabinet" variant="outlined" sx={{ minHeight: 48, py: 0, px: 2.25, borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '15px', fontWeight: 600, color: modernColors.gray[900], borderColor: modernColors.gray[300] }}>
                {t('payment.redirect.see_in_cabinet')}
              </Button>
              <Button variant="outlined" onClick={openPaymentPage} sx={{ minHeight: 48, py: 0, px: 2.25, borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '15px', fontWeight: 600 }}>
                {t('payment.redirect.open_again')}
              </Button>
            </Box>
          </Box>
        )}

        <Notice>{t('payment.redirect.opened_hint')}</Notice>
      </SectionCard>

      <SectionCard sx={{ px: { xs: 2, sm: 3.5 }, py: { xs: 2, sm: 3 }, gap: 1.75 }}>
        <CardTitle size={18}>{t('payment.redirect.after_title')}</CardTitle>
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {afterSteps.map((text, index) => (
            <Box component="li" key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box component="span" sx={{ width: 32, height: 32, borderRadius: '16px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {index + 1}
              </Box>
              <Box component="span" sx={{ fontSize: '14px', lineHeight: 1.5 }}>{text}</Box>
            </Box>
          ))}
        </Box>
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

export default CheckoutRedirectStep;
