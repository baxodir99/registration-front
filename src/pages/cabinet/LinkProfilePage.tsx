import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, OutlinedInput, Typography } from '@mui/material';
import { Check as CheckIcon, LockOutlined as LockIcon, PersonAddAlt as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CardTitle, FieldHint, FieldLabel, inputSx, Notice, PrimaryButton, SectionCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/auth';
import { formatPassport, formatPNFL } from '../../utils/validation';
import { VALIDATION } from '../../constants';
import { modernColors, statusColors } from '../../theme/modernTheme';

const LinkProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, reload } = useAuth();
  const [pnfl, setPnfl] = useState('');
  const [passport, setPassport] = useState('');
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<{ kind: 'error' | 'warning' | 'neutral'; text: React.ReactNode } | null>(null);

  if (user?.has_profile) {
    return <Navigate to="/kabinet" replace />;
  }

  const valid = pnfl.length === VALIDATION.PNFL_LENGTH && VALIDATION.PASSPORT_PATTERN.test(passport);

  const submit = async () => {
    setLoading(true);
    setProblem(null);
    try {
      await authApi.linkProfile(pnfl, passport);
      await reload();
      navigate('/kabinet', { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 429) {
        const minutes = Math.max(1, Math.ceil((data?.retry_after || 60) / 60));
        setProblem({ kind: 'warning', text: <>{t('cabinet.link_limit')} <strong>{t('cabinet.link_limit_wait', { minutes })}</strong></> });
      } else if (status === 409 && data?.code === 'linked_to_other') {
        setProblem({ kind: 'neutral', text: t('cabinet.link_other') });
      } else if (status === 400 && data?.code === 'not_matched') {
        setProblem({ kind: 'error', text: <>{t('cabinet.link_not_matched')} <strong>{t('personalization.remaining_today', { count: data.remaining_today })}</strong></> });
      } else {
        setProblem({ kind: 'error', text: data?.message || t('common.error') });
      }
    } finally {
      setLoading(false);
    }
  };

  const help = (title: string, text: string, bg: string) => (
    <Box sx={{ flex: '1 1 240px', p: 2, borderRadius: '12px', backgroundColor: bg, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box component="span" sx={{ fontSize: '14px', fontWeight: 600 }}>{title}</Box>
      <Box component="span" sx={{ fontSize: '13px', lineHeight: 1.5, color: modernColors.gray[700] }}>{text}</Box>
    </Box>
  );

  return (
    <>
      <SectionCard sx={{ gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
          <Box aria-hidden sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: '24px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AddIcon />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography component="h1" sx={{ m: 0, fontSize: { xs: '20px', sm: '24px' }, fontWeight: 700 }}>{t('cabinet.link_title')}</Typography>
            <Typography sx={{ m: 0, fontSize: '14px', lineHeight: 1.5, color: modernColors.gray[600] }}>{t('cabinet.link_sub')}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="ppinfl">{t('personalization.pnfl_label')}</FieldLabel>
            <OutlinedInput id="ppinfl" value={pnfl} onChange={(e) => setPnfl(formatPNFL(e.target.value).slice(0, 14))} placeholder={t('cabinet.pnfl_placeholder')} inputProps={{ inputMode: 'numeric', maxLength: 14 }} sx={inputSx} />
            <FieldHint>{t('cabinet.pnfl_help')}</FieldHint>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            <FieldLabel htmlFor="ppass">{t('personalization.passport')}</FieldLabel>
            <OutlinedInput id="ppass" value={passport} onChange={(e) => setPassport(formatPassport(e.target.value).slice(0, 9))} placeholder="AB1234567" inputProps={{ maxLength: 9, style: { textTransform: 'uppercase' } }} sx={inputSx} />
            <FieldHint>{t('cabinet.passport_help')}</FieldHint>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.75 }}>
          <PrimaryButton loading={loading} disabled={!valid} onClick={submit} startIcon={loading ? undefined : <CheckIcon />}>
            {t('common.confirm')}
          </PrimaryButton>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '13px', color: modernColors.gray[600] }}>
            <LockIcon sx={{ fontSize: 16 }} />
            {t('cabinet.link_limit_note')}
          </Box>
        </Box>

        {problem && <Notice kind={problem.kind}>{problem.text}</Notice>}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {help(t('cabinet.link_before_title'), t('cabinet.link_before_text'), '#F6FAF8')}
          {help(t('cabinet.link_first_title'), t('cabinet.link_first_text'), statusColors.info.bg)}
        </Box>
      </SectionCard>

      <SectionCard sx={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <CardTitle size={18}>{t('cabinet.enroll_now_title')}</CardTitle>
          <Box component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>{t('cabinet.enroll_now_text')}</Box>
        </Box>
        <Button component={RouterLink} to="/" variant="outlined" sx={{ minHeight: 48, py: 0, px: 2.25, borderRadius: '10px', fontWeight: 600 }}>
          {t('cabinet.enroll')}
        </Button>
      </SectionCard>
    </>
  );
};

export default LinkProfilePage;
