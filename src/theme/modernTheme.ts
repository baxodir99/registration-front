import { createTheme, ThemeOptions } from '@mui/material/styles';

// Modern Clean Color Palette
const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE', 
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  }
};

// Modern Typography System
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  
  // Typography Scale
  display: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '44px',
    letterSpacing: '-0.02em',
  },
  headline: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '36px',
    letterSpacing: '-0.01em',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0px',
  },
  body: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0px',
  },
  button: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0px',
    textTransform: 'none' as const,
  },
  overline: {
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
};

// Spacing System - Use MUI's native spacing (8px base)
// theme.spacing(1) = 8px, theme.spacing(2) = 16px, etc.
const customSpacingValues = {
  xs: 0.5,   // 4px = theme.spacing(0.5)
  sm: 1,     // 8px = theme.spacing(1)
  md: 2,     // 16px = theme.spacing(2)
  lg: 3,     // 24px = theme.spacing(3)
  xl: 4,     // 32px = theme.spacing(4)
  '2xl': 6,  // 48px = theme.spacing(6)
  '3xl': 8,  // 64px = theme.spacing(8)
  '4xl': 10, // 80px = theme.spacing(10)
  '5xl': 12, // 96px = theme.spacing(12)
};

// Border Radius System - Minimal rounded corners
// Using small radius values for clean, modern appearance
const borderRadius = {
  none: 0,
  xs: 4,    // Minimal radius (main containers, minimal rounding)
  sm: 8,    // Small radius (cards, small elements)
  md: 12,   // Medium radius (buttons, alerts)
  lg: 16,   // Large radius (modals, large cards)
  xl: 20,   // Extra large radius
  '2xl': 24, // 2X large radius
  full: 9999,
};

// Create Modern Theme
export const createModernTheme = (): ThemeOptions => ({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.gray[600],
      light: colors.gray[400],
      dark: colors.gray[700],
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.semantic.error,
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: colors.semantic.warning,
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    info: {
      main: colors.semantic.info,
      light: colors.primary[400],
      dark: colors.primary[700],
      contrastText: '#FFFFFF',
    },
    success: {
      main: colors.semantic.success,
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.gray[50],
      paper: colors.surface.primary,
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
    },
    divider: colors.gray[200],
    action: {
      hover: colors.gray[50],
      selected: colors.primary[50],
      disabled: colors.gray[300],
      disabledBackground: colors.gray[100],
    },
  },
  
  typography: {
    fontFamily: typography.fontFamily,
    h1: typography.display,
    h2: typography.headline,
    h3: typography.title,
    h4: { ...typography.subtitle, fontWeight: 600 },
    h5: { ...typography.subtitle, fontWeight: 500 },
    h6: { ...typography.body, fontWeight: 600 },
    subtitle1: typography.subtitle,
    subtitle2: { ...typography.body, fontWeight: 500 },
    body1: typography.body,
    body2: { ...typography.caption, fontSize: '13px', lineHeight: '18px' },
    caption: typography.caption,
    button: typography.button,
    overline: typography.overline,
  },
  
  shape: {
    borderRadius: borderRadius.md,
  },
  
  spacing: 8, // 8px base unit
  
  components: {
    // Button Component - Clean, modern, no shadows
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          padding: '12px 24px',
          minHeight: 44,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
          '&:focus': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: colors.primary[600],
          color: '#FFFFFF',
          border: `1px solid ${colors.primary[600]}`,
          '&:hover': {
            backgroundColor: colors.primary[700],
            borderColor: colors.primary[700],
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        outlined: {
          borderColor: colors.gray[300],
          color: colors.gray[700],
          backgroundColor: colors.surface.primary,
          '&:hover': {
            backgroundColor: colors.gray[50],
            borderColor: colors.gray[400],
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        text: {
          color: colors.primary[600],
          '&:hover': {
            backgroundColor: colors.primary[50],
          },
        },
      },
    },
    
    // Card Component - Border-based design
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          border: `1px solid ${colors.gray[200]}`,
          backgroundColor: colors.surface.primary,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: colors.gray[300],
          },
        },
      },
    },
    
    // Paper Component - Clean surface
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          backgroundColor: colors.surface.primary,
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: 'none',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: 'none',
          border: `1px solid ${colors.gray[200]}`,
        },
        elevation2: {
          boxShadow: 'none',
          border: `1px solid ${colors.gray[300]}`,
        },
        elevation3: {
          boxShadow: 'none',
          border: `1px solid ${colors.gray[300]}`,
          backgroundColor: colors.surface.primary,
        },
      },
    },
    
    // TextField Component - Modern input styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.sm,
            backgroundColor: colors.surface.primary,
            '& fieldset': {
              borderColor: colors.gray[300],
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: colors.gray[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[600],
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: colors.semantic.error,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.gray[600],
            '&.Mui-focused': {
              color: colors.primary[600],
            },
          },
        },
      },
    },
    
    // Select Component
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.gray[300],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.gray[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[600],
            borderWidth: 2,
          },
        },
      },
    },
    
    // Chip Component - Modern tag styling
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          fontSize: '13px',
          fontWeight: 500,
          border: `1px solid ${colors.gray[200]}`,
        },
        filled: {
          backgroundColor: colors.gray[100],
          color: colors.gray[700],
          '&.MuiChip-colorPrimary': {
            backgroundColor: colors.primary[100],
            color: colors.primary[700],
            borderColor: colors.primary[200],
          },
        },
        outlined: {
          borderColor: colors.gray[300],
          '&.MuiChip-colorPrimary': {
            borderColor: colors.primary[300],
            color: colors.primary[600],
          },
        },
      },
    },
    
    // Alert Component
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          border: '1px solid',
          boxShadow: 'none',
        },
        standardSuccess: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.success,
          color: colors.gray[800],
          '& .MuiAlert-icon': {
            color: colors.semantic.success,
          },
        },
        standardError: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.error,
          color: colors.gray[800],
          '& .MuiAlert-icon': {
            color: colors.semantic.error,
          },
        },
        standardWarning: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.warning,
          color: colors.gray[800],
          '& .MuiAlert-icon': {
            color: colors.semantic.warning,
          },
        },
        standardInfo: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.info,
          color: colors.gray[800],
          '& .MuiAlert-icon': {
            color: colors.semantic.info,
          },
        },
      },
    },
    
    // Stepper Component
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
          fontWeight: 500,
          color: colors.gray[600],
          '&.Mui-active': {
            fontWeight: 600,
            color: colors.primary[600],
          },
          '&.Mui-completed': {
            color: colors.semantic.success,
            fontWeight: 500,
          },
        },
      },
    },
    
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: colors.primary[600],
          },
          '&.Mui-completed': {
            color: colors.semantic.success,
          },
        },
      },
    },
    
    // LinearProgress Component
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          backgroundColor: colors.gray[200],
        },
        bar: {
          borderRadius: borderRadius.full,
          backgroundColor: colors.primary[600],
        },
      },
    },
  },
});

// Export theme and utilities
export const modernTheme = createTheme(createModernTheme());

// Export color and spacing utilities
export const modernColors = colors;
export const modernSpacingValues = customSpacingValues;
export const modernBorderRadius = borderRadius;
export const modernTypography = typography;

// Helper function to create MUI spacing function-compatible values
export const modernSpacing = (value: number | string) => {
  if (typeof value === 'number') {
    return value * 8; // MUI base spacing
  }
  if (value in customSpacingValues) {
    return customSpacingValues[value as keyof typeof customSpacingValues] * 8;
  }
  return 8; // fallback
};

// Export no-shadow constant (replaces md3Elevation)
export const noShadow = 'none';