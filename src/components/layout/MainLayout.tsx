import React from 'react';
import { Box, Container } from '@mui/material';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: modernColors.gray[50],
        minHeight: '100vh',
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
