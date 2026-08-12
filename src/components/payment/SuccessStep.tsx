import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { PaymentResponse } from '../../types';
import { OutlinedButton } from '../MD3Components';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import InvoiceSummary from './InvoiceSummary';

interface SuccessStepProps {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onDownload: () => void;
  onNewRegistration: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onDownload,
  onNewRegistration,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 88,
            height: 88,
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            mb: 2.5,
            animation: 'successPop 0.5s ease-out',
            '@keyframes successPop': {
              '0%': { transform: 'scale(0)', opacity: 0 },
              '60%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 26, sm: 32 },
            fontWeight: 700,
            color: modernColors.gray[900],
            mb: 1,
          }}
        >
          {t('payment.card.success_title')}
        </Typography>
        <Typography sx={{ fontSize: 15, color: modernColors.gray[600] }}>
          {t('payment.card.success_subtitle')}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <InvoiceSummary
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
          paid
        />
      </Box>

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
            onClick={onDownload}
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
          {t('payment.card.success_info')}
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

export default SuccessStep;
