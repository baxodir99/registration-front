import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CardPreviewProps {
  cardNumber: string;
  expiry: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardNumber, expiry }) => {
  const { t } = useTranslation();
  const digits = cardNumber.replace(/\D/g, '').padEnd(16, '•');
  const groups = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 16)];

  return (
    <Box
      aria-hidden
      sx={{
        flex: { xs: '1 1 100%', sm: '0 0 300px' },
        maxWidth: { xs: 340, sm: 300 },
        height: 184,
        boxSizing: 'border-box',
        p: 2.75,
        borderRadius: '16px',
        backgroundColor: '#0F3D36',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ width: 40, height: 30, borderRadius: '6px', backgroundColor: '#C9A85C' }} />
        <Box component="span" sx={{ fontSize: '12px', fontWeight: 600, color: '#BFD9D2' }}>UZCARD · HUMO</Box>
      </Box>
      <Box sx={{ fontSize: { xs: '18px', sm: '20px' }, fontWeight: 600, letterSpacing: '0.1em', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {groups.join(' ')}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#BFD9D2' }}>
        <span>{t('payment.card.expiry')}</span>
        <Box component="span" sx={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>{expiry || 'MM/YY'}</Box>
      </Box>
    </Box>
  );
};

export default CardPreview;
