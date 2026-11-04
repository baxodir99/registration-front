import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { modernColors } from '../../theme/modernTheme';
import { FormStep } from '../../types';

interface ProgressStepperProps {
  currentStep: FormStep;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const steps = [
    t('steps.exam_selection'),
    t('steps.personalization'),
    t('steps.confirmation'),
    t('steps.payment'),
  ];

  const segment = (index: number) => (
    <Box
      sx={{
        height: '4px',
        borderRadius: '2px',
        backgroundColor: index < currentStep ? modernColors.primary[600] : modernColors.gray[200],
      }}
    />
  );

  if (isMobile) {
    const next = steps[currentStep];
    return (
      <Box
        sx={{
          mx: -2,
          mt: -3,
          px: 2,
          pt: 1.75,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          backgroundColor: modernColors.surface.primary,
          borderBottom: `1px solid ${modernColors.gray[200]}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
          <Typography component="span" sx={{ fontSize: '18px', fontWeight: 700 }}>
            {steps[currentStep - 1]}
          </Typography>
          <Typography component="span" sx={{ fontSize: '13px', fontWeight: 600, color: modernColors.gray[600], whiteSpace: 'nowrap' }}>
            {currentStep} / {steps.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, gap: 0.5 }}>
          {steps.map((_, index) => (
            <React.Fragment key={index}>{segment(index)}</React.Fragment>
          ))}
        </Box>
        {next && (
          <Typography component="span" sx={{ fontSize: '12px', color: modernColors.gray[500] }}>
            {t('stepper.next_is', { name: next })}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      component="ol"
      aria-label={t('stepper.label')}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        gap: 1,
      }}
    >
      {steps.map((label, index) => {
        const number = index + 1;
        const done = number < currentStep;
        const current = number === currentStep;
        return (
          <Box
            component="li"
            key={label}
            aria-current={current ? 'step' : undefined}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            {segment(index)}
            <Typography
              component="span"
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: done || current ? modernColors.primary[600] : modernColors.gray[500],
              }}
            >
              {done ? t('stepper.done') : t('stepper.step_n', { n: number })}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: '14px',
                fontWeight: current ? 600 : 500,
                color: current ? modernColors.gray[900] : modernColors.gray[600],
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProgressStepper;
