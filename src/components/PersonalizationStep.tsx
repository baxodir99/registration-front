import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FilledTextField, FilledButton, OutlinedButton, SurfaceCard } from './MD3Components';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { apiService } from '../services/api';
import { personalizationSchema } from '../utils/validation';
import { formatPNFL, formatPassport } from '../utils/validation';
import { FormData, UserProfile } from '../types';
import { modernBorderRadius } from '../theme/modernTheme';

interface PersonalizationStepProps {
  initialData?: Partial<FormData>;
  onNext: (data: Partial<FormData>) => void;
  onPrevious: () => void;
  onDataChange: (data: Partial<FormData>) => void;
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({
  initialData,
  onNext,
  onPrevious,
  onDataChange,
}) => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    initialData?.userProfile || null
  );

  const formik = useFormik({
    initialValues: {
      pnfl: initialData?.pnfl || '',
      passport: initialData?.passport || '',
    },
    validationSchema: personalizationSchema,
    onSubmit: async (values) => {
      await checkPersonalization(values);
    },
  });

  // Update parent data when form changes
  React.useEffect(() => {
    onDataChange({
      pnfl: formik.values.pnfl || undefined,
      passport: formik.values.passport || undefined,
      userProfile: userProfile || undefined,
    });
  }, [formik.values, userProfile, onDataChange]);

  const checkPersonalization = async (values: { pnfl: string; passport: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.checkPersonalization({
        pnfl: values.pnfl,
        passport: values.passport,
      });

      if (response.status === 1 || response.status === 2) {
        // Success - personalization verified
        setUserProfile(response.data!);
        
        // Store the form data but don't auto-proceed
        // User needs to review their information and click continue
        const formData: Partial<FormData> = {
          pnfl: values.pnfl,
          passport: values.passport,
          userProfile: response.data!,
        };
        onDataChange(formData);
      } else {
        // Failed - personalization not verified
        setError(t('messages.personalization_failed'));
        setUserProfile(null);
      }
    } catch (error: any) {
      console.error('Personalization check error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t('messages.personalization_failed'));
      }
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePNFLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    const formatted = formatPNFL(value);
    if (formatted.length <= 14) {
      formik.setFieldValue('pnfl', formatted);
    }
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    const formatted = formatPassport(value);
    if (formatted.length <= 9) {
      formik.setFieldValue('passport', formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const handleNext = () => {
    if (userProfile) {
      const formData: Partial<FormData> = {
        pnfl: formik.values.pnfl,
        passport: formik.values.passport,
        userProfile: userProfile,
      };
      onNext(formData);
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
        {t('personalization.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 3, sm: 4, md: 6 }, borderRadius: modernBorderRadius.lg }}>
          {error}
        </Alert>
      )}

      {userProfile && (
        <Alert severity="success" sx={{ mb: { xs: 3, sm: 4, md: 6 }, borderRadius: modernBorderRadius.lg }}>
          {t('messages.personalization_success')}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: { xs: 3, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4, md: 6 } }}>
          {/* PNFL Field */}
          <FilledTextField
            fullWidth
            name="pnfl"
            label={t('personalization.pnfl')}
            placeholder={t('personalization.pnfl_placeholder')}
            value={formik.values.pnfl}
            onChange={handlePNFLChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pnfl && Boolean(formik.errors.pnfl)}
            helperText={formik.touched.pnfl && t(formik.errors.pnfl as string)}
            inputProps={{
              maxLength: 14,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            disabled={loading}
          />

          {/* Passport Field */}
          <FilledTextField
            fullWidth
            name="passport"
            label={t('personalization.passport')}
            placeholder={t('personalization.passport_placeholder')}
            value={formik.values.passport}
            onChange={handlePassportChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passport && Boolean(formik.errors.passport)}
            helperText={formik.touched.passport && t(formik.errors.passport as string)}
            inputProps={{
              maxLength: 9,
              style: { textTransform: 'uppercase' },
            }}
            disabled={loading}
          />

          {/* Check Button */}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={!formik.isValid || !formik.values.pnfl || !formik.values.passport}
            size="large"
            loadingIndicator={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <span>{t('common.loading')}</span>
              </Box>
            }
          >
            {t('personalization.check')}
          </LoadingButton>
        </Box>
      </Box>

      {/* User Profile Display */}
      {userProfile && (
        <SurfaceCard surfaceVariant="elevated" sx={{
          p: { xs: 3, sm: 4, md: 6, lg: 8 },
          mb: { xs: 4, sm: 6, md: 8 }
        }}>
          <Typography variant="h4" gutterBottom sx={{
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            fontWeight: 600,
            mb: { xs: 3, sm: 4, md: 6 }
          }}>
            {t('user_info.title')}
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, sm: 3, md: 4 },
            rowGap: { xs: 3, sm: 4, md: 6 }
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.full_name')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.full_name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.passport_number')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.passport}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.birth_date')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(userProfile.birth_date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.birth_place')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.birth_place}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.nationality')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.nationality}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.sex')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.sex === '1' ? 'Erkak' : 'Ayol'}
              </Typography>
            </Box>

            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.doc_give_place')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userProfile.doc_give_place}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('user_info.doc_valid_period')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(userProfile.matches_date_begin_document).toLocaleDateString()} - {' '}
                {new Date(userProfile.matches_date_end_document).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </SurfaceCard>
      )}

      {/* Navigation Buttons */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        mt: { xs: 6, sm: 8, md: 10 },
        gap: { xs: 2, sm: 3, md: 4 }
      }}>
        <OutlinedButton
          onClick={onPrevious}
          disabled={loading}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('common.previous')}
        </OutlinedButton>

        {userProfile && (
          <FilledButton
            onClick={handleNext}
            disabled={loading}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              }
            }}
          >
            {t('common.continue')}
          </FilledButton>
        )}
      </Box>
    </Box>
  );
};

export default PersonalizationStep;