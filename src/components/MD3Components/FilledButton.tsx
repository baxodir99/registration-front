import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernBorderRadius, modernColors } from '../../theme/modernTheme';

// Modern Filled Button - Clean flat design
const ModernFilledButton = styled(Button)(({ theme }) => ({
  borderRadius: modernBorderRadius.lg,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0em',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 24,
  paddingRight: 24,
  minHeight: 44,
  boxShadow: 'none', // NO SHADOWS
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: 'none', // NO SHADOWS
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: modernColors.gray[200],
    color: modernColors.gray[400],
    boxShadow: 'none',
    transform: 'none',
    cursor: 'not-allowed',
  },
}));

interface FilledButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
}

const FilledButton: React.FC<FilledButtonProps> = ({ children, ...props }) => {
  return (
    <ModernFilledButton variant="contained" {...props}>
      {children}
    </ModernFilledButton>
  );
};

export default FilledButton;