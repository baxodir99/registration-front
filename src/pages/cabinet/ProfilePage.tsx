import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Link, OutlinedInput, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CardTitle, FieldLabel, inputSx, Notice, SectionCard } from '../../components/ui';
import OtpInput from '../../components/payment/OtpInput';
import { useAuth } from '../../context/AuthContext';
import { authApi, LoginEvent } from '../../services/auth';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { errorText, PasswordFields, passwordRules } from '../LoginPage';

const smallButton = { minHeight: 44, py: 0, px: 2, borderRadius: '10px', fontSize: '14px', fontWeight: 600 };
const outlined = { ...smallButton, color: modernColors.gray[900], borderColor: modernColors.gray[300] };

const formatPhone = (phone: string) => phone.replace(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4');

const deviceName = (agent: string) => {
  const browser = /Edg\//.test(agent) ? 'Edge' : /Chrome\//.test(agent) ? 'Chrome' : /Firefox\//.test(agent) ? 'Firefox' : /Safari\//.test(agent) ? 'Safari' : '';
  const system = /iPhone|iPad/.test(agent) ? 'iPhone' : /Android/.test(agent) ? 'Android' : /Windows/.test(agent) ? 'Windows' : /Mac OS/.test(agent) ? 'macOS' : /Linux/.test(agent) ? 'Linux' : '';
  return [browser, system].filter(Boolean).join(' · ') || '—';
};

const formatTime = (value: string) => {
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const PasswordSection: React.FC = () => {
  const { t } = useTranslation();
  const { user, reload } = useAuth();
  const [stage, setStage] = useState<'idle' | 'code' | 'form'>('idle');
  const [sessionId, setSessionId] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const start = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const sent = await authApi.sendCode(user!.phone, 'set_password');
      setSessionId(sent.session_id);
      setCode('');
      setStage('code');
    } catch (err: any) {
      setError(errorText(err, t('auth.sms_failed')));
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.verifyCode(sessionId, code);
      setStage('form');
    } catch (err: any) {
      const left = err?.response?.data?.attempts_left;
      setError(left ? `${t('auth.wrong_code')} ${t('auth.attempts_left', { count: left })}` : t('auth.wrong_code'));
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.setPassword(password, password2);
      await reload();
      setPassword('');
      setPassword2('');
      setStage('idle');
      setSaved(true);
    } catch (err: any) {
      setError(errorText(err, t('common.error')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard sx={{ gap: 1.75 }}>
      <CardTitle size={18}>{t('cabinet.login_method')}</CardTitle>
      {saved && <Notice kind="info">{t('auth.password_changed')}</Notice>}
      {stage === 'idle' && (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Box component="span" sx={{ fontSize: '15px', fontWeight: 600 }}>{t('auth.password')}</Box>
              <Box component="span" sx={{ fontSize: '13px', color: modernColors.gray[600] }}>
                {t(user?.has_password ? 'cabinet.password_set' : 'cabinet.password_not_set')}
              </Box>
            </Box>
            <Button variant="outlined" disabled={loading} onClick={start} sx={outlined}>
              {t(user?.has_password ? 'cabinet.change_password' : 'cabinet.set_password')}
            </Button>
          </Box>
          <Typography sx={{ m: 0, fontSize: '13px', color: modernColors.gray[500] }}>{t('cabinet.password_sms_hint')}</Typography>
        </>
      )}
      {stage === 'code' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, alignItems: 'center' }}>
          <Typography sx={{ m: 0, fontSize: '14px', color: modernColors.gray[600], textAlign: 'center' }}>{t('cabinet.enter_sms_code')}</Typography>
          <OtpInput value={code} onChange={setCode} hasError={Boolean(error)} disabled={loading} autoFocus />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => setStage('idle')} sx={outlined}>{t('common.cancel')}</Button>
            <Button variant="contained" disableElevation disabled={loading || code.length !== 6} onClick={verify} sx={smallButton}>{t('common.confirm')}</Button>
          </Box>
        </Box>
      )}
      {stage === 'form' && (
        <Box sx={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <PasswordFields password={password} password2={password2} onChange={(a, b) => { setPassword(a); setPassword2(b); }} />
          <Box>
            <Button variant="contained" disableElevation disabled={loading || !passwordRules(password, password2).every((r) => r.ok)} onClick={save} sx={smallButton}>
              {t('auth.save_password')}
            </Button>
          </Box>
        </Box>
      )}
      {error && <Notice kind="error">{error}</Notice>}
    </SectionCard>
  );
};

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, reload, clear } = useAuth();
  const [logins, setLogins] = useState<LoginEvent[]>([]);
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    authApi.logins().then(setLogins).catch(() => undefined);
  }, []);

  const profile = user?.profile;

  const saveEmail = async () => {
    setEmailError(null);
    try {
      await authApi.updateEmail(email.trim());
      await reload();
      setEditingEmail(false);
    } catch {
      setEmailError(t('registration_details.email_invalid'));
    }
  };

  const logoutAll = async () => {
    await authApi.logoutAll();
    clear();
    navigate('/kirish', { replace: true });
  };

  const rows = [
    { label: t('confirmation.field_pnfl'), value: profile?.pnfl_masked },
    { label: t('confirmation.field_passport'), value: profile?.passport_masked },
    { label: t('confirmation.field_phone'), value: user ? formatPhone(user.phone) : '' },
  ];
  const dt = { fontSize: '12px', color: modernColors.gray[600] };
  const dd = { fontSize: '15px', fontWeight: 500, overflowWrap: 'anywhere' };

  return (
    <>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>{t('cabinet.nav_profile')}</Typography>

      <SectionCard sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2.5 }}>
        <Box sx={{ width: 96, height: 120, borderRadius: '10px', overflow: 'hidden', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {profile?.photo ? (
            <img src={profile.photo.startsWith('data:') ? profile.photo : `data:image/jpeg;base64,${profile.photo}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <PersonIcon sx={{ fontSize: 44 }} />
          )}
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography component="span" sx={{ fontSize: '20px', fontWeight: 700 }}>{profile?.full_name}</Typography>
            <Typography component="span" sx={{ fontSize: '13px', fontWeight: 600, color: statusColors.success.text }}>✓ {t('cabinet.profile_confirmed')}</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.75 }}>
            {rows.map((row) => (
              <Box key={row.label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Box component="span" sx={dt}>{row.label}</Box>
                <Box component="span" sx={dd}>{row.value}</Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
              {editingEmail ? (
                <>
                  <FieldLabel htmlFor="cabinet-email">{t('confirmation.field_email')}</FieldLabel>
                  <OutlinedInput id="cabinet-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={Boolean(emailError)} sx={inputSx} />
                  {emailError && <Box component="span" sx={{ fontSize: '12px', color: statusColors.error.text }}>{emailError}</Box>}
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Button variant="contained" disableElevation onClick={saveEmail} sx={smallButton}>{t('common.save')}</Button>
                    <Button variant="outlined" onClick={() => setEditingEmail(false)} sx={outlined}>{t('common.cancel')}</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box component="span" sx={dt}>{t('confirmation.field_email')}</Box>
                  <Box component="span" sx={dd}>
                    {user?.email || '—'}{' '}
                    <Link component="button" type="button" onClick={() => { setEmail(user?.email || ''); setEditingEmail(true); }} sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {t('confirmation.edit')}
                    </Link>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </SectionCard>

      <PasswordSection />

      <SectionCard sx={{ gap: 1.25 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <CardTitle size={18}>{t('cabinet.login_history')}</CardTitle>
          <Button variant="outlined" onClick={logoutAll} sx={outlined}>{t('cabinet.logout_all')}</Button>
        </Box>
        {logins.map((event, index) => (
          <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1, py: 1.25, borderTop: index ? `1px solid ${modernColors.gray[200]}` : 0, fontSize: '14px' }}>
            <span>
              <strong>{deviceName(event.user_agent)}</strong> — {event.ip}
              {!event.success && <Box component="span" sx={{ ml: 1, color: statusColors.error.text, fontWeight: 600 }}>{t('cabinet.login_failed')}</Box>}
            </span>
            <Box component="span" sx={{ color: modernColors.gray[600] }}>{formatTime(event.created_at)}</Box>
          </Box>
        ))}
        <Typography sx={{ m: 0, pt: 0.5, fontSize: '13px', color: modernColors.gray[500] }}>{t('cabinet.unknown_login_hint')}</Typography>
      </SectionCard>
    </>
  );
};

export default ProfilePage;
