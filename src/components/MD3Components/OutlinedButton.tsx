import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernBorderRadius, modernColors } from '../../theme/modernTheme';

// Modern Outlined Button - Uses global theme colors and border radius
const ModernOutlinedButton = styled(Button)(({ theme }) => ({
  borderRadius: modernBorderRadius.xs,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0em',
  paddingTop: 14,
  paddingBottom: 14,
  paddingLeft: 24,
  paddingRight: 24,
  minHeight: 48,
  borderWidth: 1,
  borderColor: modernColors.gray[300],
  color: modernColors.gray[700],
  backgroundColor: modernColors.surface.primary,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: modernColors.gray[50],
    borderColor: modernColors.gray[400],
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&:focus': {
    boxShadow: 'none',
  },
  '&:disabled': {
    borderColor: modernColors.gray[200],
    color: modernColors.gray[400],
    backgroundColor: 'transparent',
    transform: 'none',
    cursor: 'not-allowed',
  },
}));

interface OutlinedButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({ children, ...props }) => {
  return (
    <ModernOutlinedButton variant="outlined" {...props}>
      {children}
    </ModernOutlinedButton>
  );
};

export default OutlinedButton;