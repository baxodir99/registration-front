import { createTheme, ThemeOptions } from '@mui/material/styles';

// Material Design 3 Color Palette
const md3Colors = {
  primary: {
    main: '#6750A4',
    light: '#9A82DB',
    dark: '#4F378B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#625B71',
    light: '#8E8298',
    dark: '#49454F',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7D5260',
    light: '#A37E8C',
    dark: '#633B48',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#DE3730',
    dark: '#93000A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FE5F00',
    light: '#FF8F50',
    dark: '#C44300',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#006E1C',
    light: '#4F9A62',
    dark: '#004F0F',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0061A4',
    light: '#5886C5',
    dark: '#004881',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFBFE',
    paper: '#F7F2FA',
  },
  surface: {
    main: '#FEF7FF',
    variant: '#E7E0EC',
    tint: '#6750A4',
  },
  outline: {
    main: '#79747E',
    variant: '#CAC4D0',
  },
  text: {
    primary: '#1D1B20',
    secondary: '#49454F',
    disabled: '#79747E',
  },
};

// Material Design 3 Typography Scale
const md3Typography = {
  fontFamily: [
    '"Inter"',
    '"SF Pro Display"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  
  // Display styles
  displayLarge: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: '56px',
    letterSpacing: '-0.5px',
  },
  displayMedium: {
    fontSize: '40px',
    fontWeight: 600,
    lineHeight: '48px',
    letterSpacing: '-0.25px',
  },
  displaySmall: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: '40px',
    letterSpacing: '0px',
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '36px',
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: '32px',
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  
  // Title styles
  titleLarge: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '26px',
    letterSpacing: '0px',
  },
  titleMedium: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.1px',
  },
  titleSmall: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  
  // Body styles
  bodyLarge: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0px',
  },
  bodyMedium: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0px',
  },
  bodySmall: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0px',
  },
  
  // Label styles
  labelLarge: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0px',
  },
  labelMedium: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0px',
  },
  labelSmall: {
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0px',
  },
};

// Material Design 3 Shape System
const md3Shape = {
  borderRadius: {
    none: 0,
    extraSmall: 2,
    small: 4,
    medium: 6,
    large: 8,
    extraLarge: 12,
    full: 9999,
  },
};

// Material Design 3 Elevation
export const md3Elevation = {
  level0: 'none',
  level1: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  level2: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  level3: '0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
  level4: '0px 2px 3px 0px rgba(0, 0, 0, 0.30), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  level5: '0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
} as const;

// Create Material Design 3 Theme
export const createMaterial3Theme = (): ThemeOptions => ({
  palette: {
    mode: 'light',
    primary: md3Colors.primary,
    secondary: md3Colors.secondary,
    error: md3Colors.error,
    warning: md3Colors.warning,
    info: md3Colors.info,
    success: md3Colors.success,
    background: md3Colors.background,
    text: md3Colors.text,
  },
  
  typography: {
    fontFamily: md3Typography.fontFamily,
    
    // Map MD3 typography to MUI variants
    h1: md3Typography.displayLarge,
    h2: md3Typography.displayMedium,
    h3: md3Typography.displaySmall,
    h4: md3Typography.headlineLarge,
    h5: md3Typography.headlineMedium,
    h6: md3Typography.headlineSmall,
    subtitle1: md3Typography.titleLarge,
    subtitle2: md3Typography.titleMedium,
    body1: md3Typography.bodyLarge,
    body2: md3Typography.bodyMedium,
    caption: md3Typography.bodySmall,
    button: md3Typography.labelLarge,
    overline: md3Typography.labelSmall,
  },
  
  shape: {
    borderRadius: md3Shape.borderRadius.medium,
  },
  
  spacing: 4, // MD3 uses 4px grid
  
  components: {
    // Button styles following MD3
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: md3Shape.borderRadius.medium,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0.1px',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          minHeight: 40,
        },
        contained: {
          boxShadow: md3Elevation.level1,
          '&:hover': {
            boxShadow: md3Elevation.level2,
          },
        },
        outlined: {
          borderColor: md3Colors.outline.main,
          '&:hover': {
            backgroundColor: `${md3Colors.primary.main}08`,
          },
        },
      },
    },
    
    // Card styles following MD3
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: md3Shape.borderRadius.large,
          boxShadow: md3Elevation.level1,
          backgroundColor: md3Colors.surface.main,
        },
      },
    },
    
    // Paper styles following MD3
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: md3Shape.borderRadius.large,
          backgroundColor: md3Colors.surface.main,
        },
        elevation1: {
          boxShadow: md3Elevation.level1,
        },
        elevation2: {
          boxShadow: md3Elevation.level2,
        },
        elevation3: {
          boxShadow: md3Elevation.level3,
        },
      },
    },
    
    // TextField styles following MD3
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: md3Shape.borderRadius.small,
            '& fieldset': {
              borderColor: md3Colors.outline.main,
            },
            '&:hover fieldset': {
              borderColor: md3Colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: md3Colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    // Chip styles following MD3
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: md3Shape.borderRadius.small,
          fontSize: '14px',
          fontWeight: 500,
        },
        filled: {
          backgroundColor: md3Colors.surface.variant,
          color: md3Colors.text.primary,
        },
      },
    },
    
    // AppBar styles following MD3
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: md3Colors.surface.main,
          color: md3Colors.text.primary,
          boxShadow: md3Elevation.level2,
        },
      },
    },
    
    // Stepper styles following MD3
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
          fontWeight: 500,
          '&.Mui-active': {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export const md3Theme = createTheme(createMaterial3Theme());