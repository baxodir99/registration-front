import React from 'react';
import { Box } from '@mui/material';
import { modernColors } from '../../theme/modernTheme';

interface StepContentProps {
  children: React.ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flex: '999 1 560px',
        minWidth: 0,
        boxSizing: 'border-box',
        p: { xs: 2, sm: 3.5 },
        backgroundColor: modernColors.surface.primary,
        borderRadius: '16px',
        border: `1px solid ${modernColors.gray[200]}`,
      }}
    >
      {children}
    </Box>
  );
};

export default StepContent;
