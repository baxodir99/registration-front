import React from 'react';
import { Box } from '@mui/material';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';

interface StepContentProps {
  children: React.ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        backgroundColor: modernColors.surface.primary,
        borderRadius: modernBorderRadius.xs,
        border: `1px solid ${modernColors.gray[200]}`,
        position: 'relative',
        overflow: 'visible',
        minHeight: { xs: '400px', sm: '500px', md: '600px' },
      }}
    >
      {children}
    </Box>
  );
};

export default StepContent;
