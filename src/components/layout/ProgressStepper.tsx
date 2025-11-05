import React from 'react';
import { Box, Stepper, Step, StepLabel, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';
import { FormStep } from '../../types';

interface ProgressStepperProps {
  currentStep: FormStep;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const getStepperSteps = () => {
    return [
      t('steps.exam_selection'),
      t('steps.personalization'),
      t('steps.registration_details'),
      t('steps.confirmation'),
      t('steps.payment'),
    ];
  };

  // Hide on mobile for payment step
  if (isMobile && currentStep === FormStep.PAYMENT) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: { xs: 2, sm: 2.5, md: 3 },
        p: { xs: 2, sm: 3, md: 4, lg: 6 },
        backgroundColor: modernColors.surface.primary,
        borderRadius: modernBorderRadius.xxs,
        border: `1px solid ${modernColors.gray[200]}`,
      }}
    >
      <Stepper
        activeStep={currentStep - 1}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{
          '& .MuiStepLabel-label': {
            fontSize: '14px',
            fontWeight: 400,
            color: modernColors.gray[600],
          },
          '& .MuiStepLabel-label.Mui-active': {
            fontWeight: 500,
            color: modernColors.primary[600],
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: modernColors.semantic.success,
            fontWeight: 400,
          },
          '& .MuiStepIcon-root': {
            fontSize: '24px',
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: modernColors.primary[600],
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: modernColors.semantic.success,
          },
          '& .MuiStepConnector-line': {
            borderColor: modernColors.gray[300],
            borderTopWidth: 2,
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: modernColors.primary[600],
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: modernColors.semantic.success,
          },
        }}
      >
        {getStepperSteps().map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressStepper;
