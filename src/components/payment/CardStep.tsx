import React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { PaymentResponse } from '../../types';
import { FilledTextField } from '../MD3Components';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import CardPreview from './CardPreview';
import InvoiceSummary from './InvoiceSummary';

interface CardStepProps {
  cardNumber: string;
  setCardNumber: (v: string) => void;
  expiry: string;
  setExpiry: (v: string) => void;
  cardFocus: 'number' | 'expiry' | null;
  setCardFocus: (v: 'number' | 'expiry' | null) => void;
  cardValid: boolean;
  expiryValid: boolean;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
}

const CardStep: React.FC<CardStepProps> = ({
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cardFocus,
  setCardFocus,
  cardValid,
  expiryValid,
  error,
  loading,
  onSubmit,
  paymentData,
  originalAmount,
  hasDiscount,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 3, md: 5 },
        alignItems: 'start',
      }}
    >
      <Stack spacing={3} sx={{ order: { xs: 1, md: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CardPreview cardNumber={cardNumber} expiry={expiry} focus={cardFocus} />
        </Box>
        <InvoiceSummary
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
        />
      </Stack>

      <Box sx={{ order: { xs: 2, md: 1 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 700,
              color: modernColors.gray[900],
              mb: 0.5,
            }}
          >
            {t('payment.card.title')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: modernColors.gray[600] }}>
            {t('payment.card.subtitle')}
          </Typography>
        </Box>

        <Collapse in={Boolean(error)}>
          <Alert
            severity="error"
            sx={{ mb: 2.5, borderRadius: modernBorderRadius.xs }}
          >
            {error}
          </Alert>
        </Collapse>

        <Stack spacing={2.5}>
          <FilledTextField
            label={t('payment.card.card_number')}
            placeholder="1234 5678 9012 3456"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onFocus={() => setCardFocus('number')}
            onBlur={() => setCardFocus(null)}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 19,
              autoComplete: 'cc-number',
              'aria-label': t('payment.card.card_number'),
            }}
            helperText={t('payment.card.card_number_hint')}
          />
          <FilledTextField
            label={t('payment.card.expiry')}
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            onFocus={() => setCardFocus('expiry')}
            onBlur={() => setCardFocus(null)}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 5,
              autoComplete: 'cc-exp',
              'aria-label': t('payment.card.expiry'),
            }}
            sx={{ maxWidth: { sm: 180 } }}
            helperText={t('payment.card.expiry_hint')}
          />
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 3,
            mb: 2,
            color: modernColors.gray[500],
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 12 }}>
            {t('payment.card.secure_note')}
          </Typography>
        </Box>

        <LoadingButton
          variant="contained"
          size="large"
          fullWidth
          onClick={onSubmit}
          loading={loading}
          disabled={!cardValid || !expiryValid}
          loadingIndicator={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={18} />
              <span>{t('common.loading')}</span>
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
          {t('payment.card.continue')}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default CardStep;
