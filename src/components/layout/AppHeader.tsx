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

const LOGO_STYLE: React.CSSProperties = { width: 44, height: 44, objectFit: 'contain' };

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
          py: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, minWidth: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <img src="/im.png" alt="" style={LOGO_STYLE} />
            <img src="/uzbmb.svg" alt="" style={LOGO_STYLE} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.25 }}>
              {t('header.org_name')}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: modernColors.gray[600], lineHeight: 1.3 }}>
              {t('header.org_parent')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25 }}>
          <Link
            href={`tel:${SUPPORT_PHONE_TEL}`}
            underline="hover"
            sx={{
              minHeight: 44,
              px: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
              fontWeight: 500,
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
                sx={{
                  width: 44,
                  height: 44,
                  border: `1px solid ${modernColors.gray[200]}`,
                  borderRadius: '10px',
                }}
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
