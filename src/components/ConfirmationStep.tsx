import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  ContactPhone as ContactPhoneIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FormData } from '../types';
import { apiService } from '../services/api';
import { SurfaceCard } from './MD3Components';
import { modernBorderRadius } from '../theme/modernTheme';

interface ConfirmationStepProps {
  formData: FormData;
  types: any[];
  regions: any[];
  examNames: any[];
  exams: any[];
  examDates: any[];
  onNext: (data: { paymentData: any }) => void;
  onPrevious: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  types,
  regions,
  examNames,
  exams,
  examDates,
  onNext,
  onPrevious,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get display data
  const type = types.find(t => t.id === formData.type);
  const region = regions.find(r => r.id === formData.region);
  const examName = examNames.find(en => en.id === formData.examName);
  const exam = exams.find(e => e.id === formData.exam);
  const examDate = examDates.find(ed => ed.id === formData.examDate);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      const invoiceData = {
        pnfl: formData.pnfl!,
        examdate: formData.examDate!,
        phone: formData.phone!,
        email: formData.email!,
        region: formData.region!,
        terms_accepted: formData.terms_accepted!,
      };

      const response = await apiService.createInvoice(invoiceData);

      if (response.status === 1) {
        onNext({ paymentData: response.data });
      } else {
        setError(response.message || t('messages.registration_failed'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t('messages.registration_failed'));
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box>
      <Typography variant="h2" gutterBottom sx={{
        fontSize: { xs: '20px', sm: '24px', md: '28px' },
        fontWeight: 600,
        mb: { xs: 3, sm: 4, md: 6 },
        color: 'text.primary'
      }}>
        {t('confirmation.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: modernBorderRadius.lg }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4, md: 6 } }}>
        {/* Exam Information */}
        <SurfaceCard surfaceVariant="elevated" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            <SchoolIcon color="primary" sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant="h4" sx={{
              fontSize: { xs: '16px', sm: '17px', md: '18px' },
              fontWeight: 600
            }}>
              {t('confirmation.exam_info')}
            </Typography>
          </Box>
          <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3, md: 4 } }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('exam_selection.exam_name')}
              </Typography>
              <Typography variant="body1">
                {examName?.name}
              </Typography>
            </Box>

            {type && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('exam_selection.type')}
                </Typography>
                <Typography variant="body1">
                  {type.name}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('exam_selection.region')}
              </Typography>
              <Typography variant="body1">
                {region?.name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('exam_selection.exam')}
              </Typography>
              <Typography variant="body1">
                {exam?.name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('exam_selection.exam_date')}
              </Typography>
              <Typography variant="body1">
                {examDate && new Date(examDate.date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('confirmation.payment_amount')}
              </Typography>
              <Chip 
                label={`${exam?.amount} so'm`}
                color="primary"
                size="medium"
                sx={{
                  borderRadius: modernBorderRadius.sm + 'px',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              />
            </Box>
          </Box>
        </SurfaceCard>

        {/* Personal Information */}
        <SurfaceCard surfaceVariant="elevated" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            <PersonIcon color="primary" sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant="h6" sx={{
              fontSize: { xs: '16px', sm: '17px', md: '18px' },
              fontWeight: 600
            }}>
              {t('confirmation.personal_info')}
            </Typography>
          </Box>
          <Divider sx={{ mb: { xs: 2, sm: 2 } }} />

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, sm: 2.5, md: 3 },
            rowGap: { xs: 2, sm: 3, md: 4 }
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.full_name')}
              </Typography>
              <Typography variant="body1">
                {formData.userProfile?.full_name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('personalization.pnfl')}
              </Typography>
              <Typography variant="body1">
                {formData.pnfl}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.passport_number')}
              </Typography>
              <Typography variant="body1">
                {formData.userProfile?.passport}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.birth_date')}
              </Typography>
              <Typography variant="body1">
                {formData.userProfile && 
                  new Date(formData.userProfile.birth_date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.nationality')}
              </Typography>
              <Typography variant="body1">
                {formData.userProfile?.nationality}
              </Typography>
            </Box>
          </Box>
        </SurfaceCard>

        {/* Contact Information */}
        <SurfaceCard surfaceVariant="elevated" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            <ContactPhoneIcon color="primary" sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant="h6" sx={{
              fontSize: { xs: '16px', sm: '17px', md: '18px' },
              fontWeight: 600
            }}>
              {t('confirmation.contact_info')}
            </Typography>
          </Box>
          <Divider sx={{ mb: { xs: 2, sm: 2 } }} />

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 2, sm: 2.5, md: 3 },
            rowGap: { xs: 2, sm: 3, md: 4 }
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('registration_details.phone')}
              </Typography>
              <Typography variant="body1">
                {formData.phone}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('registration_details.email')}
              </Typography>
              <Typography variant="body1">
                {formData.email}
              </Typography>
            </Box>
          </Box>
        </SurfaceCard>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        mt: { xs: 6, sm: 8, md: 10 },
        gap: { xs: 2, sm: 2, md: 2 }
      }}>
        <Button
          variant="outlined"
          onClick={onPrevious}
          disabled={loading}
          sx={{
            borderRadius: modernBorderRadius.lg + 'px',
            textTransform: 'none',
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1.2, sm: 1.4, md: 1.5 },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('common.previous')}
        </Button>

        <LoadingButton
          variant="contained"
          onClick={handleConfirm}
          loading={loading}
          startIcon={<PaymentIcon />}
          loadingIndicator={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <span>{t('common.loading')}</span>
            </Box>
          }
          size="large"
          sx={{
            borderRadius: modernBorderRadius.lg + 'px',
            textTransform: 'none',
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1.2, sm: 1.4, md: 1.5 },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('confirmation.confirm_registration')}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ConfirmationStep;