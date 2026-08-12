import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Sms as SmsIcon,
  TaskAlt as TaskAltIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { modernColors } from '../../theme/modernTheme';

export type SubStep = 'card' | 'otp' | 'success';

interface SubStepperProps {
  current: SubStep;
}

const SubStepper: React.FC<SubStepperProps> = ({ current }) => {
  const { t } = useTranslation();
  const steps: { key: SubStep; label: string; icon: React.ReactNode }[] = [
    { key: 'card', label: t('payment.card.step_card'), icon: <CreditCardIcon /> },
    { key: 'otp', label: t('payment.card.step_otp'), icon: <SmsIcon /> },
    { key: 'success', label: t('payment.card.step_done'), icon: <TaskAltIcon /> },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: { xs: 3, sm: 4 },
      }}
    >
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const colorActive = active || done;
        return (
          <React.Fragment key={step.key}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${
                    colorActive ? modernColors.primary[600] : modernColors.gray[300]
                  }`,
                  backgroundColor: done
                    ? modernColors.primary[600]
                    : active
                    ? modernColors.primary[50]
                    : '#FFFFFF',
                  color: done
                    ? '#FFFFFF'
                    : active
                    ? modernColors.primary[700]
                    : modernColors.gray[400],
                  transition: 'all 0.25s ease',
                  '& svg': { fontSize: { xs: 18, sm: 20 } },
                }}
              >
                {done ? <TaskAltIcon /> : step.icon}
              </Box>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: 11, sm: 13 },
                  fontWeight: active ? 600 : 500,
                  color: colorActive ? modernColors.gray[900] : modernColors.gray[500],
                }}
              >
                {step.label}
              </Typography>
            </Box>
            {idx < steps.length - 1 && (
              <Box
                sx={{
                  flex: '0 1 80px',
                  maxWidth: { xs: 40, sm: 80 },
                  mx: { xs: 1, sm: 1.5 },
                  mt: '-20px',
                  height: 2,
                  backgroundColor: done
                    ? modernColors.primary[600]
                    : modernColors.gray[200],
                  transition: 'background-color 0.25s ease',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default SubStepper;
