import { createTheme, ThemeOptions } from '@mui/material/styles';

// Modern Clean Color Palette - Soft & Easy on Eyes
const colors = {
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Main - Soft Sky Blue
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  gray: {
    50: '#FAFAF9',   // Very light warm gray
    100: '#F5F5F4',  // Light warm gray
    200: '#E7E5E4',  // Soft gray
    300: '#D6D3D1',  // Medium light gray
    400: '#A8A29E',  // Medium gray
    500: '#78716C',  // Text secondary
    600: '#57534E',  // Text primary
    700: '#44403C',  // Dark text
    800: '#292524',  // Very dark
    900: '#1C1917',  // Almost black
  },
  semantic: {
    success: '#16A34A',  // Softer green
    warning: '#EA580C',  // Softer orange
    error: '#DC2626',    // Softer red
    info: '#0EA5E9',     // Sky blue
  },
  surface: {
    primary: '#FFFFFF',     // Pure white for cards
    secondary: '#FAFAF9',   // Very light warm background
    tertiary: '#F5F5F4',    // Light warm background
    body: '#FAFAF9',        // Body background - warm light
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
  xxs: 2,   // Ultra minimal (main containers, barely visible rounding)
  xs: 4,    // Minimal radius (alerts, small elements)
  sm: 8,    // Small radius (cards, nested elements)
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
          borderRadius: borderRadius.xs,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          padding: '14px 24px',
          minHeight: 48,
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
          borderRadius: borderRadius.xs,
          border: `1px solid ${colors.gray[200]}`,
          backgroundColor: colors.surface.primary,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: colors.gray[200],
          },
        },
      },
    },

    // Paper Component - Clean surface
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xs,
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
          border: `1px solid ${colors.gray[200]}`,
        },
        elevation3: {
          boxShadow: 'none',
          border: `1px solid ${colors.gray[200]}`,
          backgroundColor: colors.surface.primary,
        },
      },
    },

    // TextField Component - Modern input styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.xs,
            backgroundColor: colors.surface.primary,
            '& fieldset': {
              borderColor: colors.gray[200],
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: colors.gray[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
              borderWidth: 1,
            },
            '&.Mui-error fieldset': {
              borderColor: colors.semantic.error,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.gray[500],
            '&.Mui-focused': {
              color: colors.primary[500],
            },
          },
        },
      },
    },
    
    // Select Component
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xs,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.gray[200],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.gray[300],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[500],
            borderWidth: 1,
          },
        },
      },
    },

    // Chip Component - Modern tag styling
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xs,
          fontSize: '13px',
          fontWeight: 500,
          border: `1px solid ${colors.gray[200]}`,
        },
        filled: {
          backgroundColor: colors.surface.secondary,
          color: colors.gray[700],
          '&.MuiChip-colorPrimary': {
            backgroundColor: colors.primary[100],
            color: colors.primary[700],
            borderColor: colors.primary[200],
          },
        },
        outlined: {
          borderColor: colors.gray[200],
          '&.MuiChip-colorPrimary': {
            borderColor: colors.primary[200],
            color: colors.primary[600],
          },
        },
      },
    },
    
    // Alert Component
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xs,
          border: '1px solid',
          boxShadow: 'none',
        },
        standardSuccess: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.success,
          color: colors.gray[700],
          '& .MuiAlert-icon': {
            color: colors.semantic.success,
          },
        },
        standardError: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.error,
          color: colors.gray[700],
          '& .MuiAlert-icon': {
            color: colors.semantic.error,
          },
        },
        standardWarning: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.warning,
          color: colors.gray[700],
          '& .MuiAlert-icon': {
            color: colors.semantic.warning,
          },
        },
        standardInfo: {
          backgroundColor: colors.surface.primary,
          borderColor: colors.semantic.info,
          color: colors.gray[700],
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