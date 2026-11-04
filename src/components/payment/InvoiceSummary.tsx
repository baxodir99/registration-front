import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaymentResponse } from '../../types';
import { formatMoney } from '../../utils/price';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { AsideCard, Divider, SummaryRow, SupportLine, TotalRow } from '../ui';

export interface PaymentDetails {
  examLabel?: string;
  dateLabel?: string;
  participant?: string;
  deadline?: string;
}

interface InvoiceSummaryProps extends PaymentDetails {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  compact?: boolean;
  support?: boolean;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  examLabel,
  dateLabel,
  participant,
  deadline,
  compact,
  support,
}) => {
  const { t } = useTranslation();
  const currency = t('payment.currency');

  return (
    <AsideCard>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.375 }}>
        <Typography component="span" sx={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: modernColors.gray[500] }}>
          {t('payment.card.invoice_label')}
        </Typography>
        <Typography component="span" sx={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.04em', overflowWrap: 'anywhere' }}>
          {paymentData.invoice}
        </Typography>
      </Box>
      {!compact && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {examLabel && <SummaryRow strong label={t('payment.summary_exam')} value={examLabel} />}
          {dateLabel && <SummaryRow label={t('payment.summary_date')} value={dateLabel} />}
          {participant && <SummaryRow label={t('payment.summary_participant')} value={participant} />}
        </Box>
      )}
      <Divider />
      {hasDiscount && originalAmount !== undefined && (
        <SummaryRow
          label={t('confirmation.original_amount')}
          value={<Box component="span" sx={{ color: modernColors.gray[600], textDecoration: 'line-through' }}>{formatMoney(originalAmount)} {currency}</Box>}
        />
      )}
      <TotalRow label={t('payment.card.total_label')} value={`${formatMoney(paymentData.amount)} ${currency}`} />
      {deadline && (
        <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: statusColors.warning.bg, fontSize: '13px', lineHeight: 1.5, color: '#5C3B08' }}>
          {t('payment.deadline_before')} <strong>{deadline}</strong> {t('payment.deadline_after')}
        </Box>
      )}
      {support && <SupportLine />}
    </AsideCard>
  );
};

export default InvoiceSummary;
