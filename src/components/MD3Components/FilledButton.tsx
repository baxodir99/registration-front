import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernBorderRadius, modernColors } from '../../theme/modernTheme';

// Modern Filled Button - Uses global theme colors and border radius
const ModernFilledButton = styled(Button)(({ theme }) => ({
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
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: modernColors.primary[600],
  color: '#FFFFFF',
  border: `1px solid ${modernColors.primary[600]}`,
  '&:hover': {
    backgroundColor: modernColors.primary[700],
    borderColor: modernColors.primary[700],
    boxShadow: 'none',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&:focus': {
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: modernColors.gray[200],
    color: modernColors.gray[400],
    borderColor: modernColors.gray[200],
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