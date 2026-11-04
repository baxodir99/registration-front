import React from 'react';
import { Box } from '@mui/material';
import { modernColors } from '../../theme/modernTheme';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: modernColors.surface.body, minHeight: '100vh' }}>
      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          boxSizing: 'border-box',
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, sm: 4 },
          pb: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
