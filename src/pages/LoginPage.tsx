import React, { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, InputAdornment, Link, OutlinedInput, Typography } from '@mui/material';
import { ArrowBack as BackIcon, Check as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Notice, FieldLabel, inputSx, PasswordInput, PrimaryButton } from '../components/ui';
import OtpInput from '../components/payment/OtpInput';
import LanguageSelector from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { authApi, LoginResult } from '../services/auth';
import { SUPPORT_PHONE_TEL } from '../constants';
import { modernColors } from '../theme/modernTheme';

type Stage = 'phone' | 'code' | 'reset' | 'set_password';

const groupPhone = (digits: string) =>
  [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ');

const maskPhone = (digits: string) => `+998 ${digits.slice(0, 2)} *** ** ${digits.slice(7, 9)}`;

export const passwordRules = (password: string, password2: string) => [
  { key: 'rule_length', ok: password.length >= 8 },
  { key: 'rule_letter_digit', ok: /[^\W\d_]/.test(password) && /\d/.test(password) },
  { key: 'rule_same', ok: password.length > 0 && password === password2 },
];

export const PasswordFields: React.FC<{
  password: string;
  password2: string;
  onChange: (password: string, password2: string) => void;
}> = ({ password, password2, onChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <FieldLabel htmlFor="pw1">{t('auth.new_password')}</FieldLabel>
        <PasswordInput id="pw1" autoComplete="new-password" value={password} onChange={(e) => onChange(e.target.value, password2)} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <FieldLabel htmlFor="pw2">{t('auth.repeat_password')}</FieldLabel>
        <PasswordInput id="pw2" autoComplete="new-password" value={password2} onChange={(e) => onChange(password, e.target.value)} />
      </Box>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '13px' }}>
        {passwordRules(password, password2).map((rule) => (
          <Box component="li" key={rule.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: rule.ok ? modernColors.semantic.success : modernColors.gray[500] }}>
            <CheckIcon sx={{ fontSize: 16, opacity: rule.ok ? 1 : 0.4 }} />
            {t(`auth.${rule.key}`)}
          </Box>
        ))}
      </Box>
    </>
  );
};

/** Backend javobidan foydalanuvchiga ko'rsatiladigan matn */
export const errorText = (err: any, fallback: string): string => {
  const data = err?.response?.data;
  return data?.message || data?.password?.[0] || data?.password2?.[0] || fallback;
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, ready, reload } = useAuth();

  const [stage, setStage] = useState<Stage>('phone');
  const [mode, setMode] = useState<'sms' | 'password'>('sms');
  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [code, setCode] = useState('');
  const [purpose, setPurpose] = useState<'login' | 'reset_password'>('login');
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const phone = `+998${digits}`;
  const phoneValid = digits.length === 9;

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  const goNext = (hasProfile: boolean) => {
    const next = params.get('next');
    const safe = next && next.startsWith('/') && !next.startsWith('//') ? next : '/kabinet';
    navigate(hasProfile ? safe : '/kabinet/profil-qoshish', { replace: true });
  };

  const run = async (action: () => Promise<void>, fallback: string) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (err: any) {
      setError(errorText(err, fallback));
    } finally {
      setLoading(false);
    }
  };

  const sendCode = (nextPurpose: 'login' | 'reset_password') =>
    run(async () => {
      const sent = await authApi.sendCode(phone, nextPurpose);
      setSessionId(sent.session_id);
      setPurpose(nextPurpose);
      setResendIn(sent.resend_in);
      setCode('');
      setPassword('');
      setPassword2('');
      setStage(nextPurpose === 'login' ? 'code' : 'reset');
    }, t('auth.sms_failed'));

  const afterLogin = async (result: LoginResult) => {
    setFinishing(true);
    await reload();
    if (result.has_password) {
      goNext(result.has_profile);
    } else {
      setStage('set_password');
      setFinishing(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    setError(null);
    try {
      await afterLogin(await authApi.verifyCode(sessionId, code));
    } catch (err: any) {
      const left = err?.response?.data?.attempts_left;
      setError(left ? `${t('auth.wrong_code')} ${t('auth.attempts_left', { count: left })}` : t('auth.wrong_code'));
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const passwordLogin = () =>
    run(async () => {
      await afterLogin(await authApi.passwordLogin(phone, password));
    }, t('auth.wrong_password'));

  const resetPassword = () =>
    run(async () => {
      await authApi.resetPassword(sessionId, code, password, password2);
      setMode('password');
      setPassword('');
      setPassword2('');
      setCode('');
      setStage('phone');
      setNotice(t('auth.password_changed'));
    }, t('auth.wrong_code'));

  const savePassword = () =>
    run(async () => {
      await authApi.setPassword(password, password2);
      const me = await reload();
      goNext(Boolean(me?.has_profile));
    }, t('common.error'));

  const rulesOk = passwordRules(password, password2).every((rule) => rule.ok);

  if (ready && user && stage === 'phone' && !finishing) {
    return <Navigate to={user.has_profile ? '/kabinet' : '/kabinet/profil-qoshish'} replace />;
  }

  const heading = (title: string, subtitle: string) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Typography component="h1" sx={{ m: 0, fontSize: '24px', fontWeight: 700 }}>{title}</Typography>
      <Typography sx={{ m: 0, fontSize: '14px', lineHeight: 1.5, color: modernColors.gray[600] }}>{subtitle}</Typography>
    </Box>
  );

  const backLink = (
    <Link component="button" type="button" onClick={() => { setStage('phone'); setError(null); }} sx={{ alignSelf: 'flex-start', minHeight: 44, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '14px', fontWeight: 600 }}>
      <BackIcon sx={{ fontSize: 18 }} />
      {t('auth.change_phone')}
    </Link>
  );

  const codeBlock = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
      <OtpInput value={code} onChange={setCode} hasError={Boolean(error)} disabled={loading} autoFocus />
      <Typography component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>
        {t('payment.card.code_not_received')}{' '}
        {resendIn > 0 ? (
          <>
            {t('payment.card.resend')}{' '}
            <Box component="strong" sx={{ color: modernColors.gray[900] }}>
              {Math.floor(resendIn / 60)}:{String(resendIn % 60).padStart(2, '0')}
            </Box>
          </>
        ) : (
          <Link component="button" type="button" onClick={() => sendCode(purpose)} sx={{ fontSize: '14px', fontWeight: 600, verticalAlign: 'baseline' }}>
            {t('payment.card.resend')}
          </Link>
        )}
      </Typography>
    </Box>
  );

  const tabSx = (active: boolean) => ({
    flex: 1,
    minHeight: 44,
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 600,
    color: active ? modernColors.gray[900] : modernColors.gray[600],
    backgroundColor: active ? '#FFFFFF' : 'transparent',
    '&:hover': { backgroundColor: active ? '#FFFFFF' : modernColors.gray[100] },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: modernColors.surface.body }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '1 1 50%',
          maxWidth: 640,
          boxSizing: 'border-box',
          p: 5,
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 4,
          backgroundColor: '#0F3D36',
          color: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 0.75, borderRadius: '10px', backgroundColor: '#FFFFFF', display: 'flex' }}>
            <img src="/ilmiy-logo.png" alt="" style={{ width: 42, height: 30, objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.25 }}>{t('header.org_name')}</Typography>
            <Typography sx={{ fontSize: '13px', color: '#BFD9D2', lineHeight: 1.3 }}>{t('header.org_parent')}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography component="h2" sx={{ m: 0, fontSize: '36px', lineHeight: 1.2, fontWeight: 700 }}>{t('auth.promo_title')}</Typography>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((n) => (
              <Box component="li" key={n} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box component="span" sx={{ width: 32, height: 32, flexShrink: 0, borderRadius: '16px', backgroundColor: '#1C5A50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>{t(`auth.promo_${n}`)}</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#BFD9D2' }}>{t(`auth.promo_${n}_sub`)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Typography component="span" sx={{ fontSize: '13px', color: '#BFD9D2' }}>
          {t('payment.questions')}{' '}
          <Link href={`tel:${SUPPORT_PHONE_TEL}`} sx={{ color: '#FFFFFF', fontWeight: 600 }}>(95) 515-68-68</Link>
        </Typography>
      </Box>

      <Box sx={{ flex: '1 1 50%', minWidth: 0, boxSizing: 'border-box', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <LanguageSelector />
        </Box>
        <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 420,
              boxSizing: 'border-box',
              p: { xs: 2.5, sm: 3.5 },
              backgroundColor: modernColors.surface.primary,
              border: `1px solid ${modernColors.gray[200]}`,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.25,
            }}
          >
            {notice && <Notice kind="info">{notice}</Notice>}

            {stage === 'phone' && (
              <>
                {heading(t('auth.title'), t('auth.subtitle'))}
                <Box role="tablist" aria-label={t('auth.method')} sx={{ display: 'flex', gap: 0.5, p: 0.5, borderRadius: '10px', backgroundColor: modernColors.gray[50] }}>
                  <Button role="tab" aria-selected={mode === 'sms'} onClick={() => { setMode('sms'); setError(null); }} sx={tabSx(mode === 'sms')}>{t('auth.tab_sms')}</Button>
                  <Button role="tab" aria-selected={mode === 'password'} onClick={() => { setMode('password'); setError(null); }} sx={tabSx(mode === 'password')}>{t('auth.tab_password')}</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <FieldLabel htmlFor="lphone">{t('registration_details.phone')}</FieldLabel>
                  <OutlinedInput
                    id="lphone"
                    value={groupPhone(digits)}
                    onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder="90 123 45 67"
                    autoComplete="tel-national"
                    inputProps={{ inputMode: 'tel' }}
                    sx={{ ...(inputSx as object), pl: 0, overflow: 'hidden' }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ m: 0, mr: 1.5, height: 'auto', alignSelf: 'stretch', maxHeight: 'none', px: 1.5, backgroundColor: modernColors.gray[50], borderRight: `1px solid ${modernColors.gray[300]}` }}>
                        +998
                      </InputAdornment>
                    }
                  />
                </Box>
                {mode === 'sms' ? (
                  <PrimaryButton fullWidth loading={loading} disabled={!phoneValid} onClick={() => sendCode('login')}>
                    {t('auth.get_code')}
                  </PrimaryButton>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FieldLabel htmlFor="lpw">{t('auth.password')}</FieldLabel>
                        <Link component="button" type="button" disabled={!phoneValid} onClick={() => sendCode('reset_password')} sx={{ fontSize: '13px', fontWeight: 600 }}>
                          {t('auth.forgot')}
                        </Link>
                      </Box>
                      <PasswordInput id="lpw" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Box>
                    <PrimaryButton fullWidth loading={loading} disabled={!phoneValid || !password} onClick={passwordLogin}>
                      {t('auth.login')}
                    </PrimaryButton>
                    <Typography sx={{ m: 0, fontSize: '13px', lineHeight: 1.5, color: modernColors.gray[600] }}>{t('auth.no_password_hint')}</Typography>
                  </>
                )}
                {error && <Notice kind="error">{error}</Notice>}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '13px', color: modernColors.gray[500] }}>
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: modernColors.gray[200] }} />
                  {t('auth.or')}
                  <Box sx={{ flex: 1, height: '1px', backgroundColor: modernColors.gray[200] }} />
                </Box>
                <Link component={RouterLink} to="/" sx={{ textAlign: 'center', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 600 }}>
                  {t('auth.register_without_login')}
                </Link>
              </>
            )}

            {stage === 'code' && (
              <>
                {backLink}
                {heading(t('auth.code_title'), t('auth.code_sub', { phone: maskPhone(digits) }))}
                {codeBlock}
                <PrimaryButton fullWidth loading={loading} disabled={code.length !== 6} onClick={verify}>
                  {t('common.confirm')}
                </PrimaryButton>
                {error && <Notice kind="error">{error}</Notice>}
              </>
            )}

            {stage === 'reset' && (
              <>
                {backLink}
                {heading(t('auth.reset_title'), t('auth.code_sub', { phone: maskPhone(digits) }))}
                {codeBlock}
                <PasswordFields password={password} password2={password2} onChange={(a, b) => { setPassword(a); setPassword2(b); }} />
                <PrimaryButton fullWidth loading={loading} disabled={code.length !== 6 || !rulesOk} onClick={resetPassword}>
                  {t('auth.save_password')}
                </PrimaryButton>
                {error && <Notice kind="error">{error}</Notice>}
              </>
            )}

            {stage === 'set_password' && (
              <>
                <Box component="span" sx={{ alignSelf: 'flex-start', px: 1.25, py: 0.25, borderRadius: '8px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {t('auth.optional')}
                </Box>
                {heading(t('auth.set_title'), t('auth.set_sub'))}
                <PasswordFields password={password} password2={password2} onChange={(a, b) => { setPassword(a); setPassword2(b); }} />
                <PrimaryButton fullWidth loading={loading} disabled={!rulesOk} onClick={savePassword}>
                  {t('auth.save_continue')}
                </PrimaryButton>
                {error && <Notice kind="error">{error}</Notice>}
                <Link component="button" type="button" onClick={() => goNext(Boolean(user?.has_profile))} sx={{ minHeight: 44, fontSize: '15px', fontWeight: 600 }}>
                  {t('auth.later')}
                </Link>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
