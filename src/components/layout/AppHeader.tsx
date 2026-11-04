import React from 'react';
import { Box, IconButton, Link, Tooltip, Typography } from '@mui/material';
import { Phone as PhoneIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import { SUPPORT_PHONE_TEL } from '../../constants';
import { modernColors } from '../../theme/modernTheme';
import { FormStep } from '../../types';

interface AppHeaderProps {
  currentStep: FormStep;
  onOpenResetDialog: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentStep, onOpenResetDialog }) => {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: modernColors.surface.primary,
        borderBottom: `1px solid ${modernColors.gray[200]}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          boxSizing: 'border-box',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.75 }, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Box component="img" src="/ilmiy-logo.png" alt="" sx={{ width: { xs: 42, sm: 56 }, height: { xs: 30, sm: 40 }, objectFit: 'contain' }} />
            <Box component="img" src="/uzbmb.svg" alt="" sx={{ display: { xs: 'none', sm: 'block' }, width: 44, height: 44, objectFit: 'contain' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 700, lineHeight: 1.25 }}>
              {t('header.org_name')}
            </Typography>
            <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: '13px', color: modernColors.gray[600], lineHeight: 1.3 }}>
              {t('header.org_parent')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.25 }, flexShrink: 0 }}>
          <Link
            href={`tel:${SUPPORT_PHONE_TEL}`}
            underline="hover"
            sx={{
              display: { xs: 'none', md: 'flex' },
              minHeight: 44,
              px: 1,
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <PhoneIcon sx={{ fontSize: 18 }} />
            {t('header.help')}
          </Link>
          {currentStep !== FormStep.PAYMENT && (
            <Tooltip title={t('header.reset_tooltip')}>
              <IconButton
                onClick={onOpenResetDialog}
                aria-label={t('header.reset_tooltip')}
                sx={{ width: 44, height: 44, border: `1px solid ${modernColors.gray[200]}`, borderRadius: '10px' }}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          )}
          <LanguageSelector />
        </Box>
      </Box>
    </Box>
  );
};

export default AppHeader;
