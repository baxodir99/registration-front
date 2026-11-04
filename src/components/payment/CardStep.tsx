import React from 'react';
import { Box, OutlinedInput } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { modernColors } from '../../theme/modernTheme';
import { FieldHint, FieldLabel, inputSx, Notice, PageTitle, PrimaryButton } from '../ui';
import CardPreview from './CardPreview';

interface CardStepProps {
  cardNumber: string;
  setCardNumber: (v: string) => void;
  expiry: string;
  setExpiry: (v: string) => void;
  cardValid: boolean;
  expiryValid: boolean;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
}

const CardStep: React.FC<CardStepProps> = ({
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cardValid,
  expiryValid,
  error,
  loading,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const bigInput = {
    ...(inputSx as object),
    minHeight: 52,
    fontSize: '18px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: modernColors.primary[600], borderWidth: 2 },
  };

  return (
    <>
      <PageTitle title={t('payment.card.title')} subtitle={t('payment.card.subtitle')} />

      {error && <Notice kind="error">{error}</Notice>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        <CardPreview cardNumber={cardNumber} expiry={expiry} />
        <Box sx={{ flex: '1 1 260px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <FieldLabel htmlFor="card">{t('payment.card.card_number')}</FieldLabel>
            <OutlinedInput
              id="card"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              inputProps={{ inputMode: 'numeric', maxLength: 19, autoComplete: 'cc-number', style: { letterSpacing: '0.08em' } }}
              sx={bigInput}
            />
            <FieldHint>{t('payment.card.card_number_hint')}</FieldHint>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxWidth: 160 }}>
            <FieldLabel htmlFor="expiry">{t('payment.card.expiry')}</FieldLabel>
            <OutlinedInput
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              inputProps={{ inputMode: 'numeric', maxLength: 5, autoComplete: 'cc-exp' }}
              sx={bigInput}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', p: '12px 14px', borderRadius: '10px', backgroundColor: modernColors.gray[50], fontSize: '13px', color: modernColors.gray[700] }}>
        <LockIcon sx={{ fontSize: 18 }} />
        {t('payment.card.secure_note')}
      </Box>

      <PrimaryButton tall fullWidth onClick={onSubmit} loading={loading} disabled={!cardValid || !expiryValid}>
        {t('payment.card.continue')} →
      </PrimaryButton>
    </>
  );
};

export default CardStep;
