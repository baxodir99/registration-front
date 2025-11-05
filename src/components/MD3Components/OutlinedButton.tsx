import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernBorderRadius, modernColors } from '../../theme/modernTheme';

// Modern Outlined Button - Clean flat design
const ModernOutlinedButton = styled(Button)(({ theme }) => ({
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
  borderWidth: 1,
  borderColor: modernColors.gray[300],
  color: theme.palette.primary.main,
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '08',
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
    borderColor: theme.palette.primary.main,
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