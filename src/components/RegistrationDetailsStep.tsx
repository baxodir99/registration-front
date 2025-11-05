import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { registrationDetailsSchema } from '../utils/validation';
import { formatPhone } from '../utils/validation';
import { FormData, ExamName } from '../types';
import { modernBorderRadius } from '../theme/modernTheme';

interface RegistrationDetailsStepProps {
  initialData?: Partial<FormData>;
  examNames?: ExamName[];
  onNext: (data: Partial<FormData>) => void;
  onPrevious: () => void;
  onDataChange: (data: Partial<FormData>) => void;
}

const RegistrationDetailsStep: React.FC<RegistrationDetailsStepProps> = ({
  initialData,
  examNames,
  onNext,
  onPrevious,
  onDataChange,
}) => {
  const { t } = useTranslation();

  // Get the selected exam name's offer link
  const selectedExamName = examNames?.find(en => en.id === initialData?.examName);
  const offerLink = selectedExamName?.offer;

  const handleOfferDownload = () => {
    if (offerLink) {
      window.open(offerLink, '_blank');
    }
  };

  const formik = useFormik({
    initialValues: {
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      terms_accepted: initialData?.terms_accepted || false,
    },
    validationSchema: registrationDetailsSchema,
    onSubmit: (values) => {
      const formData: Partial<FormData> = {
        phone: values.phone,
        email: values.email,
        terms_accepted: values.terms_accepted,
      };
      onNext(formData);
    },
  });

  // Update parent data when form changes
  React.useEffect(() => {
    onDataChange({
      phone: formik.values.phone || undefined,
      email: formik.values.email || undefined,
      terms_accepted: formik.values.terms_accepted,
    });
  }, [formik.values, onDataChange]);


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    const formatted = formatPhone(value);
    formik.setFieldValue('phone', formatted);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };


  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h2" gutterBottom sx={{
        fontSize: { xs: '20px', sm: '24px', md: '28px' },
        fontWeight: 600,
        mb: { xs: 3, sm: 4, md: 6 },
        color: 'text.primary'
      }}>
        {t('registration_details.title')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4, md: 6 } }}>
        {/* Phone Field */}
        <TextField
          fullWidth
          name="phone"
          label={t('registration_details.phone')}
          placeholder={t('registration_details.phone_placeholder')}
          value={formik.values.phone}
          onChange={handlePhoneChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && t(formik.errors.phone as string)}
          inputProps={{
            inputMode: 'tel',
          }}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          name="email"
          type="email"
          label={t('registration_details.email')}
          placeholder={t('registration_details.email_placeholder')}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && t(formik.errors.email as string)}
        />



        {/* Terms and Conditions */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                name="terms_accepted"
                checked={formik.values.terms_accepted}
                onChange={formik.handleChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {t('registration_details.terms')}{' '}
                </Typography>
                {offerLink ? (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Link
                      component="button"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOfferDownload();
                      }}
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                    >
                      Ommaviy oferta
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </Link>
                    <Tooltip title="Yuklab olish">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOfferDownload();
                        }}
                        sx={{ ml: 0.5 }}
                      >
                        <DownloadIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Typography variant="body2" component="span" color="text.secondary">
                    (Ommaviy oferta mavjud emas)
                  </Typography>
                )}
              </Box>
            }
          />
          {formik.touched.terms_accepted && formik.errors.terms_accepted && (
            <Alert severity="error" sx={{ mt: 1, borderRadius: modernBorderRadius.lg }}>
              {t(formik.errors.terms_accepted as string)}
            </Alert>
          )}
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        mt: { xs: 6, sm: 8, md: 10 },
        gap: { xs: 2, sm: 3, md: 4 }
      }}>
        <Button
          variant="outlined"
          onClick={onPrevious}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('common.previous')}
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || !formik.values.terms_accepted}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('common.next')}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationDetailsStep;