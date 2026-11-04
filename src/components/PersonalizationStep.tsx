import React, { useState } from 'react';
import { Box, Button, CircularProgress, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { Check as CheckIcon, Person as PersonIcon, VerifiedUser as VerifiedIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { authApi } from '../services/auth';
import {
  contactSchema,
  formatDate,
  formatDateRange,
  formatPassport,
  formatPNFL,
  personalizationSchema,
} from '../utils/validation';
import { modernColors, statusColors } from '../theme/modernTheme';
import { FormData, UserProfile } from '../types';
import {
  CardTitle,
  FieldHint,
  FieldLabel,
  inputSx,
  NavRow,
  Notice,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  StepLayout,
} from './ui';

interface PersonalizationStepProps {
  initialData?: Partial<FormData>;
  onNext: (data: Partial<FormData>) => void;
  onPrevious: () => void;
  onDataChange: (data: Partial<FormData>) => void;
  aside: React.ReactNode;
}

const PHONE_PREFIX = '+998';

/** 901234567 -> "90 123 45 67" */
const groupPhone = (digits: string) =>
  [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ');

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({
  initialData,
  onNext,
  onPrevious,
  onDataChange,
  aside,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialData?.userProfile || null);
  const { user, reload } = useAuth();
  const linked = user?.profile || null;

  // Kirgan va profili bor foydalanuvchi JSHSHIR/pasport kiritmaydi: backend profildan oladi
  React.useEffect(() => {
    if (!linked) return;
    setUserProfile({
      full_name: linked.full_name,
      passport: linked.passport_masked,
      pnfl_masked: linked.pnfl_masked,
      photo: linked.photo || '',
    } as UserProfile);
    contact.setValues({
      phone: contact.values.phone || user?.phone || '',
      email: contact.values.email || user?.email || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linked]);

  const formik = useFormik({
    initialValues: {
      pnfl: initialData?.pnfl || '',
      passport: initialData?.passport || '',
    },
    validationSchema: personalizationSchema,
    validateOnMount: true,
    onSubmit: (values) => checkPersonalization(values),
  });

  const contact = useFormik({
    initialValues: {
      phone: initialData?.phone || '',
      email: initialData?.email || '',
    },
    validationSchema: contactSchema,
    validateOnMount: true,
    onSubmit: () => undefined,
  });

  React.useEffect(() => {
    onDataChange({
      pnfl: formik.values.pnfl || undefined,
      passport: formik.values.passport || undefined,
      userProfile: userProfile || undefined,
      phone: contact.values.phone || undefined,
      email: contact.values.email || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, contact.values, userProfile]);

  const checkPersonalization = async (values: { pnfl: string; passport: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.checkPersonalization(values);
      if (response.status === 1 || response.status === 2) {
        setUserProfile(response.data!);
        // Kabinetga kirgan, lekin profili yo'q: tasdiqlangan profil akkauntga ulanadi
        if (user && !user.has_profile) {
          authApi.linkProfile(values.pnfl, values.passport).then(reload).catch(() => undefined);
        }
      } else {
        setError(t('personalization.failed'));
        setUserProfile(null);
      }
    } catch (err: any) {
      const data = err.response?.data;
      const remaining = data?.remaining_today;
      const message = err.response?.status === 429 ? data?.message : t('personalization.failed');
      setError(
        remaining === undefined || err.response?.status === 429
          ? message || t('personalization.failed')
          : `${message} ${t('personalization.remaining_today', { count: remaining })}`
      );
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Tekshirilgandan keyin raqam o'zgarsa, profil boshqa odamniki bo'lib qolmasin
  const changeIdentity = (field: 'pnfl' | 'passport', value: string) => {
    formik.setFieldValue(field, value);
    setUserProfile(null);
    setError(null);
  };

  const handleNext = () => {
    if (userProfile) {
      onNext({
        pnfl: linked ? undefined : formik.values.pnfl,
        passport: linked ? undefined : formik.values.passport,
        userProfile,
        phone: contact.values.phone,
        email: contact.values.email,
      });
    }
  };

  const phoneDigits = contact.values.phone.replace(PHONE_PREFIX, '').replace(/\D/g, '');
  const identityInput = { ...(inputSx as object), '& input': { letterSpacing: '0.06em' } };
  const profileRows = linked
    ? [
        { label: t('confirmation.field_pnfl'), value: linked.pnfl_masked },
        { label: t('user_info.passport_number'), value: linked.passport_masked },
      ]
    : userProfile
    ? [
        { label: t('user_info.birth_date'), value: formatDate(userProfile.birth_date) },
        { label: t('user_info.birth_place'), value: userProfile.birth_place },
        { label: t('user_info.sex'), value: userProfile.sex === '1' ? t('user_info.male') : t('user_info.female') },
        { label: t('user_info.nationality'), value: userProfile.nationality },
        { label: t('user_info.passport_number'), value: userProfile.passport },
        {
          label: t('user_info.doc_valid_period'),
          value: formatDateRange(userProfile.matches_date_begin_document, userProfile.matches_date_end_document),
        },
      ]
    : [];

  return (
    <StepLayout aside={aside}>
      <SectionCard sx={{ gap: 2.5 }}>
        <PageTitle title={t('personalization.title')} subtitle={linked ? t('personalization.linked_sub') : t('personalization.subtitle')} />

        {!linked && <Box
          component="form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="pnfl">{t('personalization.pnfl_label')}</FieldLabel>
            <OutlinedInput
              id="pnfl"
              name="pnfl"
              value={formik.values.pnfl}
              onChange={(e) => changeIdentity('pnfl', formatPNFL(e.target.value).slice(0, 14))}
              onBlur={formik.handleBlur}
              error={formik.touched.pnfl && Boolean(formik.errors.pnfl)}
              disabled={loading}
              inputProps={{ maxLength: 14, inputMode: 'numeric' }}
              sx={identityInput}
            />
            <FieldHint error={formik.touched.pnfl && Boolean(formik.errors.pnfl)}>
              {formik.touched.pnfl && formik.errors.pnfl ? t(formik.errors.pnfl) : t('personalization.pnfl_help')}
            </FieldHint>
          </Box>
          <Box sx={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="passport">{t('personalization.passport')}</FieldLabel>
            <OutlinedInput
              id="passport"
              name="passport"
              value={formik.values.passport}
              onChange={(e) => changeIdentity('passport', formatPassport(e.target.value).slice(0, 9))}
              onBlur={formik.handleBlur}
              error={formik.touched.passport && Boolean(formik.errors.passport)}
              disabled={loading}
              inputProps={{ maxLength: 9, style: { textTransform: 'uppercase' } }}
              sx={identityInput}
            />
            <FieldHint error={formik.touched.passport && Boolean(formik.errors.passport)}>
              {formik.touched.passport && formik.errors.passport
                ? t(formik.errors.passport)
                : t('personalization.passport_placeholder')}
            </FieldHint>
          </Box>
          <Button
            type="submit"
            variant="outlined"
            disabled={loading || !formik.isValid || Boolean(userProfile)}
            startIcon={loading ? <CircularProgress size={18} /> : userProfile ? <CheckIcon /> : undefined}
            sx={{
              mt: { xs: 0, sm: '27px' },
              width: { xs: '100%', sm: 'auto' },
              minHeight: 48,
              px: 2.75,
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              '&.Mui-disabled': userProfile
                ? { color: modernColors.primary[600], borderColor: modernColors.primary[600] }
                : {},
            }}
          >
            {userProfile ? t('personalization.checked') : t('personalization.check')}
          </Button>
        </Box>}

        {error && <Notice kind="error">{error}</Notice>}

        {userProfile && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2.5,
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: '#F6FAF8',
                border: `1px solid ${statusColors.success.border}`,
              }}
            >
              <Box
                sx={{
                  width: 96,
                  height: 120,
                  borderRadius: '10px',
                  backgroundColor: '#CFE7DD',
                  color: statusColors.success.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {userProfile.photo ? (
                  <img
                    src={userProfile.photo.startsWith('data:') ? userProfile.photo : `data:image/jpeg;base64,${userProfile.photo}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <PersonIcon sx={{ fontSize: 44 }} />
                )}
              </Box>
              <Box sx={{ flex: '1 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '13px', fontWeight: 600, color: statusColors.success.text }}>
                    <VerifiedIcon sx={{ fontSize: 16 }} />
                    {t('personalization.confirmed')}
                  </Box>
                  <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{userProfile.full_name}</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: '14px 20px' }}>
                  {profileRows.map((row) => (
                    <Box key={row.label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
                      <Box component="span" sx={{ fontSize: '12px', color: modernColors.gray[700] }}>{row.label}</Box>
                      <Box component="span" sx={{ fontSize: '15px', fontWeight: 500, overflowWrap: 'anywhere' }}>{row.value}</Box>
                    </Box>
                  ))}
                  {!linked && (
                    <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Box component="span" sx={{ fontSize: '12px', color: modernColors.gray[700] }}>{t('user_info.doc_give_place')}</Box>
                      <Box component="span" sx={{ fontSize: '15px', fontWeight: 500 }}>{userProfile.doc_give_place}</Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            {!linked && (
              <Typography sx={{ m: 0, fontSize: '13px', color: modernColors.gray[600] }}>
                {t('personalization.wrong_data_hint')}
              </Typography>
            )}
          </>
        )}
      </SectionCard>

      {userProfile && (
        <SectionCard>
          <CardTitle>{t('personalization.contact_title')}</CardTitle>
          <Notice kind="info">
            <strong>{t('personalization.contact_notice_bold')}</strong> {t('personalization.contact_notice')}
          </Notice>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
              <FieldLabel htmlFor="phone">{t('registration_details.phone')}</FieldLabel>
              <OutlinedInput
                id="phone"
                name="phone"
                value={groupPhone(phoneDigits)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                  contact.setFieldValue('phone', digits ? `${PHONE_PREFIX}${digits}` : '');
                }}
                onBlur={contact.handleBlur}
                error={contact.touched.phone && Boolean(contact.errors.phone)}
                placeholder="90 123 45 67"
                inputProps={{ inputMode: 'tel' }}
                sx={{ ...(inputSx as object), pl: 0, overflow: 'hidden' }}
                startAdornment={
                  <InputAdornment
                    position="start"
                    sx={{
                      m: 0,
                      mr: 1.5,
                      height: 'auto',
                      alignSelf: 'stretch',
                      maxHeight: 'none',
                      px: 1.5,
                      backgroundColor: modernColors.gray[50],
                      borderRight: `1px solid ${modernColors.gray[300]}`,
                      '& p': { fontSize: '15px', color: modernColors.gray[700] },
                    }}
                  >
                    {PHONE_PREFIX}
                  </InputAdornment>
                }
              />
              <FieldHint error={contact.touched.phone && Boolean(contact.errors.phone)}>
                {contact.touched.phone && contact.errors.phone ? t(contact.errors.phone) : t('personalization.phone_help')}
              </FieldHint>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
              <FieldLabel htmlFor="email">{t('registration_details.email')}</FieldLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                value={contact.values.email}
                onChange={contact.handleChange}
                onBlur={contact.handleBlur}
                error={contact.touched.email && Boolean(contact.errors.email)}
                placeholder={t('registration_details.email_placeholder')}
                sx={inputSx}
              />
              <FieldHint error={contact.touched.email && Boolean(contact.errors.email)}>
                {contact.touched.email && contact.errors.email ? t(contact.errors.email) : t('personalization.email_help')}
              </FieldHint>
            </Box>
          </Box>
        </SectionCard>
      )}

      <NavRow>
        <SecondaryButton onClick={onPrevious} disabled={loading}>← {t('common.previous')}</SecondaryButton>
        <PrimaryButton onClick={handleNext} disabled={loading || !userProfile || !contactSchema.isValidSync(contact.values)}>
          {t('common.continue')} →
        </PrimaryButton>
      </NavRow>
    </StepLayout>
  );
};

export default PersonalizationStep;
