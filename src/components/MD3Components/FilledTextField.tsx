import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernBorderRadius, modernColors } from '../../theme/modernTheme';

// Modern Outlined TextField - Clean design
const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: modernBorderRadius.xs,
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: modernColors.gray[300],
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: modernColors.gray[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
      borderWidth: 2,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0em',
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    color: modernColors.gray[600],
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '12px',
    marginLeft: 0,
    marginTop: 4,
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

interface FilledTextFieldProps extends Omit<TextFieldProps, 'variant'> {}

const FilledTextField: React.FC<FilledTextFieldProps> = (props) => {
  return <ModernTextField variant="outlined" {...props} />;
};

export default FilledTextField;