import React from 'react';
import { Box, Typography } from '@mui/material';

export type CardBrand = 'uzcard' | 'humo' | 'visa' | 'mastercard' | 'unknown';

export const detectCardBrand = (digits: string): CardBrand => {
  if (!digits) return 'unknown';
  if (/^(8600|5614|6262)/.test(digits)) return 'uzcard';
  if (/^9860/.test(digits)) return 'humo';
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  return 'unknown';
};

const BRAND_GRADIENTS: Record<CardBrand, string> = {
  uzcard: 'linear-gradient(135deg, #0F766E 0%, #0E7490 60%, #155E75 100%)',
  humo: 'linear-gradient(135deg, #1E3A8A 0%, #4338CA 60%, #6D28D9 100%)',
  visa: 'linear-gradient(135deg, #1A1F71 0%, #243391 60%, #3A4BAA 100%)',
  mastercard: 'linear-gradient(135deg, #0F172A 0%, #991B1B 60%, #EA580C 100%)',
  unknown: 'linear-gradient(135deg, #1F2937 0%, #374151 60%, #4B5563 100%)',
};

const BRAND_LABELS: Record<CardBrand, string> = {
  uzcard: 'UZCARD',
  humo: 'HUMO',
  visa: 'VISA',
  mastercard: 'Mastercard',
  unknown: '',
};

interface CardPreviewProps {
  cardNumber: string;
  expiry: string;
  focus?: 'number' | 'expiry' | null;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardNumber, expiry, focus }) => {
  const digits = cardNumber.replace(/\D/g, '');
  const brand = detectCardBrand(digits);
  const padded = digits.padEnd(16, '•');
  const groups = [
    padded.slice(0, 4),
    padded.slice(4, 8),
    padded.slice(8, 12),
    padded.slice(12, 16),
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        aspectRatio: '1.586 / 1',
        borderRadius: 3,
        background: BRAND_GRADIENTS[brand],
        boxShadow:
          '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -4px rgba(0, 0, 0, 0.12)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s ease, transform 0.3s ease',
        transform: focus ? 'translateY(-4px)' : 'translateY(0)',
        p: { xs: 2.5, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -40,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Header: chip + brand */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 32,
            borderRadius: 1,
            background:
              'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #B45309 100%)',
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              left: 4,
              right: 4,
              height: 1,
              background: 'rgba(0, 0, 0, 0.25)',
            },
            '&::before': { top: 10 },
            '&::after': { top: 20 },
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 14, sm: 16 },
            letterSpacing: 1,
            opacity: brand === 'unknown' ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          {BRAND_LABELS[brand]}
        </Typography>
      </Box>

      {/* Card number */}
      <Box
        sx={{
          position: 'relative',
          px: 0.5,
          py: 1,
          borderRadius: 1.5,
          outline:
            focus === 'number'
              ? '2px solid rgba(255, 255, 255, 0.35)'
              : '2px solid transparent',
          outlineOffset: 4,
          transition: 'outline 0.2s',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5 },
            fontFamily: '"Roboto Mono", ui-monospace, monospace',
          }}
        >
          {groups.map((g, i) => (
            <Typography
              key={i}
              component="span"
              sx={{
                fontSize: { xs: 17, sm: 20, md: 22 },
                fontWeight: 500,
                letterSpacing: 1.5,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {g}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Footer: cardholder + expiry */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              opacity: 0.65,
              letterSpacing: 1,
              textTransform: 'uppercase',
              mb: 0.25,
            }}
          >
            Karta egasi
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 500, letterSpacing: 0.5 }}
          >
            ••• •••
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'right',
            px: 0.5,
            borderRadius: 0.75,
            outline:
              focus === 'expiry'
                ? '2px solid rgba(255, 255, 255, 0.35)'
                : '2px solid transparent',
            outlineOffset: 4,
            transition: 'outline 0.2s',
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              opacity: 0.65,
              letterSpacing: 1,
              textTransform: 'uppercase',
              mb: 0.25,
            }}
          >
            Muddati
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 13, sm: 15 },
              fontWeight: 600,
              fontFamily: '"Roboto Mono", ui-monospace, monospace',
            }}
          >
            {expiry || 'MM/YY'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CardPreview;
