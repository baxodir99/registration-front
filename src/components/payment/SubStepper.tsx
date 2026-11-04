import React from 'react';
import { Box } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { modernColors } from '../../theme/modernTheme';

export type SubStep = 'card' | 'otp' | 'success';

interface SubStepperProps {
  current: SubStep;
}

const SubStepper: React.FC<SubStepperProps> = ({ current }) => {
  const { t } = useTranslation();
  const steps: { key: SubStep; label: string }[] = [
    { key: 'card', label: t('payment.card.step_card') },
    { key: 'otp', label: t('payment.card.step_otp') },
    { key: 'success', label: t('payment.card.step_done') },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <Box
      component="ol"
      aria-label={t('payment.card.steps_label')}
      sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.25 }, fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600 }}
    >
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx <= currentIdx;
        return (
          <React.Fragment key={step.key}>
            {idx > 0 && <Box component="li" aria-hidden sx={{ flex: 1, minWidth: 8, height: '2px', backgroundColor: modernColors.gray[200] }} />}
            <Box
              component="li"
              aria-current={idx === currentIdx ? 'step' : undefined}
              sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, color: active ? modernColors.primary[600] : modernColors.gray[600] }}
            >
              <Box
                component="span"
                sx={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: '14px',
                  backgroundColor: active ? modernColors.primary[600] : '#E6ECEA',
                  color: active ? '#FFFFFF' : modernColors.gray[600],
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {done ? <CheckIcon sx={{ fontSize: 16 }} /> : idx + 1}
              </Box>
              {step.label}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default SubStepper;
