import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { PhoneIphone as PhoneIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../utils/price';
import { modernColors } from '../../theme/modernTheme';
import { Notice, PrimaryButton, SecondaryButton } from '../ui';
import OtpInput from './OtpInput';

interface OtpStepProps {
  otp: string;
  setOtp: (v: string) => void;
  last4: string;
  error: string | null;
  loading: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onResend: () => void;
  resendIn: number;
  otpValid: boolean;
  amount: number;
}

const OtpStep: React.FC<OtpStepProps> = ({
  otp,
  setOtp,
  last4,
  error,
  loading,
  onConfirm,
  onBack,
  onResend,
  resendIn,
  otpValid,
  amount,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center', pt: 1 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: '28px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PhoneIcon />
        </Box>
        <Typography component="h1" sx={{ m: 0, fontSize: { xs: '20px', sm: '24px' }, fontWeight: 700 }}>
          {t('payment.card.otp_title')}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '15px', color: modernColors.gray[600] }}>
          {t('payment.card.otp_sent_to', { last4 })}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
        <OtpInput value={otp} onChange={setOtp} hasError={Boolean(error)} disabled={loading} autoFocus />
        <Typography component="span" sx={{ fontSize: '13px', color: modernColors.gray[500], textAlign: 'center' }}>
          {t('payment.card.otp_hint')}
        </Typography>
        <Typography component="span" sx={{ fontSize: '14px', color: modernColors.gray[600], textAlign: 'center' }}>
          {t('payment.card.code_not_received')}{' '}
          {resendIn > 0 ? (
            <>
              {t('payment.card.resend')}{' '}
              <Box component="strong" sx={{ color: modernColors.gray[900] }}>
                {t('payment.card.resend_in', { seconds: resendIn })}
              </Box>
            </>
          ) : (
            <Link component="button" type="button" onClick={onResend} disabled={loading} sx={{ fontWeight: 600, fontSize: '14px', verticalAlign: 'baseline' }}>
              {t('payment.card.resend')}
            </Link>
          )}
        </Typography>
      </Box>

      {error && <Notice kind="error">{error}</Notice>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        <SecondaryButton tall onClick={onBack} disabled={loading} sx={{ flex: '1 1 200px' }}>
          {t('payment.card.change_card')}
        </SecondaryButton>
        <PrimaryButton tall onClick={onConfirm} loading={loading} disabled={!otpValid} sx={{ flex: '2 1 280px' }}>
          {t('payment.card.confirm_pay_amount', { amount: formatMoney(amount), currency: t('payment.currency') })}
        </PrimaryButton>
      </Box>
    </>
  );
};

export default OtpStep;
