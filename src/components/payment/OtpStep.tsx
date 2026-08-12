import React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { PaymentResponse } from '../../types';
import { OutlinedButton } from '../MD3Components';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import InvoiceSummary from './InvoiceSummary';
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
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
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
  paymentData,
  originalAmount,
  hasDiscount,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: modernColors.primary[50],
            color: modernColors.primary[600],
            mb: 2,
          }}
        >
          <SmsIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 22, sm: 26 },
            fontWeight: 700,
            color: modernColors.gray[900],
            mb: 1,
          }}
        >
          {t('payment.card.otp_title')}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: modernColors.gray[600],
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          {t('payment.card.otp_subtitle', { last4 })}
        </Typography>
      </Box>

      <Collapse in={Boolean(error)}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: modernBorderRadius.xs }}>
          {error}
        </Alert>
      </Collapse>

      <Box sx={{ mb: 3 }}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          hasError={Boolean(error)}
          disabled={loading}
          autoFocus
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 4,
        }}
      >
        <Typography sx={{ fontSize: 13, color: modernColors.gray[600] }}>
          {t('payment.card.code_not_received')}
        </Typography>
        {resendIn > 0 ? (
          <Typography sx={{ fontSize: 13, color: modernColors.gray[400] }}>
            {t('payment.card.resend_in', { seconds: resendIn })}
          </Typography>
        ) : (
          <Box
            component="button"
            type="button"
            onClick={onResend}
            disabled={loading}
            sx={{
              background: 'none',
              border: 'none',
              p: 0,
              fontSize: 13,
              fontWeight: 600,
              color: modernColors.primary[600],
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              '&:hover': { color: modernColors.primary[700] },
              '&:disabled': { color: modernColors.gray[400] },
            }}
          >
            {t('payment.card.resend')}
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <InvoiceSummary
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: 2,
        }}
      >
        <OutlinedButton
          onClick={onBack}
          disabled={loading}
          startIcon={<ArrowBackIcon />}
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
        >
          {t('payment.card.change_card')}
        </OutlinedButton>

        <LoadingButton
          variant="contained"
          fullWidth
          onClick={onConfirm}
          loading={loading}
          disabled={!otpValid}
          startIcon={<LockIcon />}
          loadingIndicator={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={18} />
              <span>{t('payment.card.processing')}</span>
            </Box>
          }
          sx={{
            py: 1.75,
            fontSize: 15,
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: modernColors.primary[600],
            borderRadius: modernBorderRadius.xs,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: modernColors.primary[700],
              boxShadow: 'none',
            },
          }}
        >
          {t('payment.card.confirm_pay')}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default OtpStep;
