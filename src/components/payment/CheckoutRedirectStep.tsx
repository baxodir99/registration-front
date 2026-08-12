import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
  Launch as LaunchIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { PaymentResponse } from '../../types';
import { FilledButton, OutlinedButton } from '../MD3Components';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import InvoiceSummary from './InvoiceSummary';

interface CheckoutRedirectStepProps {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onNewRegistration: () => void;
}

const CheckoutRedirectStep: React.FC<CheckoutRedirectStepProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onNewRegistration,
}) => {
  const { t } = useTranslation();

  const openPaymentPage = () => {
    if (!paymentData.pay_url) return;
    window.open(paymentData.pay_url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadInfo = () => {
    if (!paymentData.info_doc) return;
    const link = document.createElement('a');
    link.href = paymentData.info_doc;
    link.download = `imtihon_malumoti_${paymentData.invoice}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            mb: 2.5,
            animation: 'redirectPop 0.5s ease-out',
            '@keyframes redirectPop': {
              '0%': { transform: 'scale(0.6)', opacity: 0 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 22, sm: 28 },
            fontWeight: 700,
            color: modernColors.gray[900],
            mb: 1,
          }}
        >
          {t('payment.redirect.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: modernColors.gray[600],
            maxWidth: 440,
            mx: 'auto',
          }}
        >
          {t('payment.redirect.subtitle')}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <InvoiceSummary
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
        />
      </Box>

      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: modernBorderRadius.xs,
          borderLeft: `4px solid ${modernColors.primary[500]}`,
          backgroundColor: modernColors.primary[50],
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: modernColors.gray[700],
            lineHeight: 1.7,
          }}
        >
          {t('payment.redirect.instructions')}
        </Typography>
      </Box>

      <FilledButton
        onClick={openPaymentPage}
        fullWidth
        startIcon={<PaymentIcon />}
        endIcon={<LaunchIcon />}
        sx={{ mb: 2, fontWeight: 600 }}
      >
        {t('payment.redirect.cta')}
      </FilledButton>

      <Typography
        sx={{
          fontSize: 12,
          color: modernColors.gray[500],
          textAlign: 'center',
          mb: 4,
        }}
      >
        {t('payment.redirect.opened_hint')}
      </Typography>

      {paymentData.info_doc && (
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: modernBorderRadius.xs,
            border: `1px dashed ${modernColors.primary[300]}`,
            backgroundColor: modernColors.primary[50],
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <InfoIcon sx={{ color: modernColors.primary[700], mt: 0.25 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: modernColors.gray[900],
                  mb: 0.5,
                }}
              >
                {t('payment.exam_info_title')}
              </Typography>
              <Typography sx={{ fontSize: 13, color: modernColors.gray[600] }}>
                {t('payment.exam_info_description')}
              </Typography>
            </Box>
          </Box>
          <OutlinedButton
            onClick={handleDownloadInfo}
            startIcon={<DownloadIcon />}
            sx={{ flexShrink: 0 }}
          >
            {t('payment.download_exam_info')}
          </OutlinedButton>
        </Box>
      )}

      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: modernBorderRadius.xs,
          backgroundColor: modernColors.surface.secondary,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        <InfoIcon sx={{ fontSize: 20, color: modernColors.gray[500], mt: 0.25 }} />
        <Typography
          sx={{
            fontSize: 13,
            color: modernColors.gray[600],
            lineHeight: 1.7,
          }}
        >
          {t('payment.redirect.after_payment_note')}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <OutlinedButton
          onClick={onNewRegistration}
          sx={{ px: 5, width: { xs: '100%', sm: 'auto' } }}
        >
          {t('payment.new_registration')}
        </OutlinedButton>
      </Box>
    </Box>
  );
};

export default CheckoutRedirectStep;
