import React from 'react';
import { Box, Container, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import { FormStep } from '../../types';

interface AppHeaderProps {
  currentStep: FormStep;
  onOpenResetDialog: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentStep, onOpenResetDialog }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        backgroundColor: modernColors.surface.body,
        pb: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4 } }}>
        <Box
          sx={{
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[200]}`,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: modernBorderRadius.lg,
            borderBottomRightRadius: modernBorderRadius.lg,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'space-between' },
              py: { xs: 2, sm: 2.5, md: 3 },
              px: { xs: 2, sm: 3, md: 4 },
              gap: { xs: 2, sm: 2.5, md: 4 },
            }}
          >
          {/* Logo Group */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3, md: 4 },
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* IM Logo */}
            <img
              src="/im.png"
              alt="IM Logo"
              style={{
                height: isMobile ? '50px' : '70px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />

            {/* UZBMB Logo */}
            <img
              src="/uzbmb.svg"
              alt="UZBMB Logo"
              style={{
                height: isMobile ? '35px' : '50px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />

            {/* Title */}
            <Typography
              variant="h2"
              sx={{
                color: modernColors.gray[900],
                fontSize: { xs: '14px', sm: '16px', md: '20px', lg: '24px' },
                fontWeight: 600,
                letterSpacing: '-0.01em',
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.2,
                mx: { xs: 0, md: 2 },
                maxWidth: { xs: '100%', sm: '300px', md: 'none' },
              }}
            >
              {t('header.title')
                .split('\n')
                .map((line: string, index: number) => (
                  <span key={index}>
                    {line}
                    {index < t('header.title').split('\n').length - 1 && <br />}
                  </span>
                ))}
            </Typography>
          </Box>

          {/* Language selector and Reset button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexShrink: 0,
            }}
          >
            {currentStep !== FormStep.PAYMENT && (
              <Tooltip title="Ma'lumotlarni tozalash">
                <IconButton
                  onClick={onOpenResetDialog}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    backgroundColor: modernColors.gray[50],
                    border: `1px solid ${modernColors.gray[200]}`,
                    borderRadius: modernBorderRadius.xs,
                    '&:hover': {
                      backgroundColor: modernColors.gray[100],
                    },
                  }}
                >
                  <RestartAltIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Tooltip>
            )}
            <LanguageSelector />
          </Box>
        </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AppHeader;
