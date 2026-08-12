import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernColors } from '../../theme/modernTheme';

const DigitBox = styled('input', {
  shouldForwardProp: (prop) => prop !== 'hasError' && prop !== 'filled',
})<{ hasError?: boolean; filled?: boolean }>(({ theme, hasError, filled }) => ({
  width: 48,
  height: 56,
  textAlign: 'center',
  fontSize: 24,
  fontWeight: 600,
  fontFamily: 'inherit',
  color: modernColors.gray[900],
  backgroundColor: filled ? modernColors.primary[50] : '#FFFFFF',
  border: `1.5px solid ${
    hasError
      ? theme.palette.error.main
      : filled
      ? modernColors.primary[400]
      : modernColors.gray[300]
  }`,
  borderRadius: 10,
  outline: 'none',
  transition: 'all 0.15s ease',
  caretColor: theme.palette.primary.main,
  '&:hover:not(:disabled)': {
    borderColor: hasError ? theme.palette.error.main : modernColors.gray[400],
  },
  '&:focus': {
    borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
    borderWidth: 2,
    boxShadow: `0 0 0 4px ${
      hasError ? 'rgba(220, 38, 38, 0.12)' : modernColors.primary[100]
    }`,
  },
  '&:disabled': {
    backgroundColor: modernColors.gray[100],
    color: modernColors.gray[400],
    cursor: 'not-allowed',
  },
  [theme.breakpoints.down('sm')]: {
    width: 42,
    height: 52,
    fontSize: 22,
  },
}));

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  hasError,
  autoFocus,
}) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      refs.current[0]?.focus();
    }
  }, [autoFocus]);

  const update = (next: string) => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    onChange(clean);
    if (clean.length === length) {
      onComplete?.(clean);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const chars = value.split('');
    chars[index] = digit;
    const joined = chars.join('').slice(0, length);
    update(joined);
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        const chars = value.split('');
        chars[index - 1] = '';
        update(chars.join(''));
        refs.current[index - 1]?.focus();
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    update(pasted);
    const target = Math.min(pasted.length, length - 1);
    refs.current[target]?.focus();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1, sm: 1.5 },
        justifyContent: 'center',
      }}
    >
      {Array.from({ length }).map((_, i) => (
        <DigitBox
          key={i}
          ref={(el: HTMLInputElement | null) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          hasError={hasError}
          filled={Boolean(value[i])}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
