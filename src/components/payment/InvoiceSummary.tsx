import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaymentResponse } from '../../types';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';

interface InvoiceSummaryProps {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  paid?: boolean;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  paid,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        borderRadius: modernBorderRadius.xs,
        border: `1px solid ${modernColors.gray[200]}`,
        backgroundColor: modernColors.surface.secondary,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: modernColors.gray[500],
          }}
        >
          {t('payment.card.invoice_label')}
        </Typography>
        {paid && (
          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              letterSpacing: 0.3,
            }}
          >
            ✓ {t('payment.card.paid_badge')}
          </Box>
        )}
      </Box>
      <Typography
        sx={{
          fontSize: { xs: 18, sm: 20 },
          fontWeight: 700,
          color: modernColors.gray[900],
          mb: 2,
          fontFamily: '"Roboto Mono", ui-monospace, monospace',
        }}
      >
        {paymentData.invoice}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: modernColors.gray[600],
          }}
        >
          {t('payment.card.total_label')}
        </Typography>
        {hasDiscount && originalAmount ? (
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: 13,
                textDecoration: 'line-through',
                color: modernColors.gray[400],
              }}
            >
              {originalAmount.toLocaleString()} {t('payment.currency')}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 700,
                color: modernColors.semantic.success,
                lineHeight: 1.2,
              }}
            >
              {paymentData.amount.toLocaleString()} {t('payment.currency')}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 700,
              color: modernColors.primary[700],
              lineHeight: 1.2,
            }}
          >
            {paymentData.amount.toLocaleString()} {t('payment.currency')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceSummary;
