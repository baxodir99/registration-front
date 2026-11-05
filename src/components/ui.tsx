// Yangi dizaynning umumiy bloklari (docs/redesign/screens maketlari asosida)
import React, { useState } from 'react';
import { Box, Button, ButtonProps, CircularProgress, IconButton, InputAdornment, Link, OutlinedInput, OutlinedInputProps, SxProps, Theme, Typography } from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  NotificationsNone as BellIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SUPPORT_PHONE_TEL } from '../constants';
import { modernColors, statusColors } from '../theme/modernTheme';

export const StepLayout: React.FC<{ aside?: React.ReactNode; children: React.ReactNode; gap?: number }> = ({
  aside,
  children,
  gap = 2.5,
}) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
    <Box sx={{ flex: '999 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap }}>{children}</Box>
    {aside}
  </Box>
);

export const SectionCard: React.FC<{ children: React.ReactNode; sx?: SxProps<Theme> }> = ({ children, sx }) => (
  <Box
    component="section"
    sx={[
      {
        boxSizing: 'border-box',
        minWidth: 0,
        backgroundColor: modernColors.surface.primary,
        border: `1px solid ${modernColors.gray[200]}`,
        borderRadius: { xs: '14px', sm: '16px' },
        p: { xs: 2, sm: 3.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2.25 },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Box>
);

export const AsideCard: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 1.75 }) => (
  <Box
    component="aside"
    sx={{
      flex: '1 1 320px',
      minWidth: 0,
      boxSizing: 'border-box',
      backgroundColor: modernColors.surface.primary,
      border: `1px solid ${modernColors.gray[200]}`,
      borderRadius: { xs: '14px', sm: '16px' },
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      gap,
    }}
  >
    {children}
  </Box>
);

export const Divider: React.FC = () => <Box sx={{ height: '1px', backgroundColor: modernColors.gray[200] }} />;

export const CardTitle: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 20 }) => (
  <Typography component="h2" sx={{ m: 0, fontSize: { xs: '16px', sm: `${size}px` }, fontWeight: 700 }}>
    {children}
  </Typography>
);

export const PageTitle: React.FC<{ title: string; subtitle?: React.ReactNode; size?: number }> = ({ title, subtitle, size = 24 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Typography component="h1" sx={{ m: 0, fontSize: { xs: '20px', sm: `${size}px` }, fontWeight: 700 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography sx={{ m: 0, fontSize: '14px', lineHeight: 1.5, color: modernColors.gray[600] }}>{subtitle}</Typography>
    )}
  </Box>
);

/** Maketdagi ustma-ust yozuv: kichik label + qiymat */
export const InfoItem: React.FC<{ label: string; value?: React.ReactNode; strong?: boolean; sx?: SxProps<Theme> }> = ({
  label,
  value,
  strong,
  sx,
}) => (
  <Box sx={[{ display: 'flex', flexDirection: 'column', gap: 0.375, minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
    <Typography
      component="span"
      sx={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: modernColors.gray[500] }}
    >
      {label}
    </Typography>
    <Typography component="span" sx={{ fontSize: '15px', fontWeight: strong ? 600 : 500, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
      {value ?? '—'}
    </Typography>
  </Box>
);

/** Yon panel qatori: chapda nom, o'ngda qiymat */
export const SummaryRow: React.FC<{ label: React.ReactNode; value: React.ReactNode; strong?: boolean }> = ({
  label,
  value,
  strong,
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, fontSize: '14px' }}>
    <Box component="span" sx={{ color: modernColors.gray[600] }}>{label}</Box>
    <Box component="span" sx={{ fontWeight: strong ? 600 : 400, textAlign: 'right', overflowWrap: 'anywhere' }}>{value}</Box>
  </Box>
);

export const TotalRow: React.FC<{ label: string; value: string; size?: number }> = ({ label, value, size = 24 }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
    <Typography component="span" sx={{ fontSize: '15px', fontWeight: 600 }}>{label}</Typography>
    <Typography component="span" sx={{ fontSize: `${size}px`, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</Typography>
  </Box>
);

export const SupportLine: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Typography sx={{ m: 0, fontSize: '13px', color: modernColors.gray[500] }}>
      {t('payment.questions')}{' '}
      <Link href={`tel:${SUPPORT_PHONE_TEL}`} sx={{ fontWeight: 600 }}>(95) 515-68-68</Link>
    </Typography>
  );
};

export const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <Typography component="label" htmlFor={htmlFor} sx={{ fontSize: '14px', fontWeight: 600 }}>
    {children}
  </Typography>
);

export const FieldHint: React.FC<{ error?: boolean; children: React.ReactNode }> = ({ error, children }) => (
  <Typography component="span" sx={{ fontSize: '12px', color: error ? statusColors.error.text : modernColors.gray[500] }}>
    {children}
  </Typography>
);

export const inputSx: SxProps<Theme> = {
  minHeight: 48,
  borderRadius: '10px',
  fontSize: '15px',
  backgroundColor: modernColors.surface.primary,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: modernColors.gray[300] },
};

/** Parol maydoni: ko'zcha bilan yozilganini ko'rish mumkin */
export const PasswordInput: React.FC<OutlinedInputProps> = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const label = t(visible ? 'auth.hide_password' : 'auth.show_password');
  return (
    <OutlinedInput
      {...props}
      type={visible ? 'text' : 'password'}
      sx={inputSx}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label={label}
            aria-pressed={visible}
            title={label}
            edge="end"
            onClick={() => setVisible((value) => !value)}
            onMouseDown={(e) => e.preventDefault()}
            sx={{ width: 44, height: 44 }}
          >
            {visible ? <HideIcon /> : <ShowIcon />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

const KIND = {
  info: { ...statusColors.info, Icon: InfoIcon },
  warning: { ...statusColors.warning, Icon: BellIcon },
  error: { ...statusColors.error, border: statusColors.error.bg, Icon: ErrorIcon },
  neutral: { bg: modernColors.gray[50], border: modernColors.gray[50], text: modernColors.gray[700], Icon: InfoIcon },
};

export const Notice: React.FC<{
  kind?: keyof typeof KIND;
  children: React.ReactNode;
  action?: React.ReactNode;
  role?: string;
}> = ({ kind = 'neutral', children, action, role }) => {
  const { Icon, bg, border, text } = KIND[kind];
  return (
    <Box
      role={role || (kind === 'error' ? 'alert' : 'note')}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        p: '12px 14px',
        borderRadius: '10px',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
        fontSize: kind === 'neutral' ? '13px' : '14px',
        lineHeight: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', flex: '1 1 240px', minWidth: 0 }}>
        <Icon sx={{ fontSize: 20, mt: '1px', flexShrink: 0 }} />
        <span>{children}</span>
      </Box>
      {action}
    </Box>
  );
};

interface BigButtonProps extends ButtonProps {
  loading?: boolean;
  tall?: boolean;
}

export const PrimaryButton: React.FC<BigButtonProps> = ({ loading, tall, disabled, children, sx, ...props }) => (
  <Button
    variant="contained"
    disableElevation
    disabled={disabled || loading}
    {...props}
    sx={[
      {
        minHeight: tall ? 56 : 52,
        px: 3.5,
        borderRadius: '12px',
        fontSize: tall ? '17px' : '16px',
        fontWeight: 600,
        border: 0,
        '&.Mui-disabled': { backgroundColor: modernColors.gray[200], color: modernColors.gray[600], border: 0 },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {loading ? <CircularProgress size={22} color="inherit" /> : children}
  </Button>
);

export const SecondaryButton: React.FC<BigButtonProps> = ({ children, sx, tall, ...props }) => (
  <Button
    variant="outlined"
    {...props}
    sx={[
      {
        minHeight: tall ? 56 : 52,
        px: 2.75,
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 600,
        color: modernColors.gray[900],
        borderColor: modernColors.gray[300],
        backgroundColor: modernColors.surface.primary,
        '&:hover': { borderColor: modernColors.gray[400], backgroundColor: modernColors.gray[50] },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Button>
);

export const NavRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1.5, '& > *': { flexGrow: { xs: 1, sm: 0 } } }}>
    {children}
  </Box>
);

export const TextLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <Link
    component="button"
    type="button"
    onClick={onClick}
    sx={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}
  >
    {children}
  </Link>
);
