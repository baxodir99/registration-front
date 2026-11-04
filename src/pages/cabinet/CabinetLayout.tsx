import React, { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Button, Link, Typography } from '@mui/material';
import {
  Add as AddIcon,
  CreditCard as PaymentsIcon,
  Description as CertificateIcon,
  EventNote as ExamsIcon,
  HomeOutlined as HomeIcon,
  InsertChartOutlined as ResultsIcon,
  LockOutlined as LockIcon,
  PersonOutline as ProfileIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';
import { useAuth } from '../../context/AuthContext';
import { authApi, Registration } from '../../services/auth';
import { modernColors, statusColors } from '../../theme/modernTheme';

export interface CabinetContext {
  registrations: Registration[];
  loading: boolean;
}

export const useCabinet = () => useOutletContext<CabinetContext>();

const NAV = [
  { to: '/kabinet', end: true, key: 'nav_home', Icon: HomeIcon, mobile: false, badge: false },
  { to: '/kabinet/imtihonlar', key: 'nav_exams', Icon: ExamsIcon, mobile: true, badge: true },
  { to: '/kabinet/natijalar', key: 'nav_results', Icon: ResultsIcon, mobile: true, badge: false },
  { to: '/kabinet/sertifikatlar', key: 'nav_certificates', Icon: CertificateIcon, mobile: true, badge: false },
  { to: '/kabinet/tolovlar', key: 'nav_payments', Icon: PaymentsIcon, mobile: true, badge: true },
  { to: '/kabinet/profil', key: 'nav_profile', Icon: ProfileIcon, mobile: true, badge: false },
];

const Badge: React.FC<{ count: number; small?: boolean }> = ({ count, small }) => (
  <Box
    component="span"
    sx={{
      minWidth: small ? 18 : 22,
      height: small ? 18 : 22,
      px: small ? '4px' : '6px',
      boxSizing: 'border-box',
      borderRadius: '11px',
      backgroundColor: statusColors.badge,
      color: '#FFFFFF',
      fontSize: small ? '11px' : '12px',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {count}
  </Box>
);

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const CabinetLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const hasProfile = Boolean(user?.has_profile);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasProfile) {
      setLoading(false);
      return;
    }
    setLoading(true);
    authApi
      .registrations()
      .then(setRegistrations)
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, [hasProfile]);

  const pending = registrations.filter((row) => row.status === 'pending').length;

  const handleLogout = async () => {
    await logout();
    navigate('/kirish', { replace: true });
  };

  const displayName = user?.profile?.full_name || user?.phone || '';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: modernColors.surface.body, pb: { xs: 10, md: 0 } }}>
      <Box component="header" sx={{ backgroundColor: modernColors.surface.primary, borderBottom: `1px solid ${modernColors.gray[200]}` }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto', boxSizing: 'border-box', px: { xs: 2, sm: 3 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          <Link component={RouterLink} to="/" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, color: 'inherit' }}>
            <Box component="img" src="/ilmiy-logo.png" alt="" sx={{ width: 50, height: 36, objectFit: 'contain', flexShrink: 0 }} />
            <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.25 }}>{t('header.org_name')}</Typography>
              <Typography sx={{ fontSize: '12px', color: modernColors.gray[600] }}>{t('cabinet.title')}</Typography>
            </Box>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <LanguageSelector />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '4px 6px 4px 4px', borderRadius: '12px', border: `1px solid ${modernColors.gray[200]}`, minWidth: 0 }}>
              <Box component="span" aria-hidden sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: '18px', backgroundColor: hasProfile ? modernColors.primary[600] : modernColors.gray[400], color: '#FFFFFF', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {hasProfile ? initials(displayName) : <ProfileIcon sx={{ fontSize: 20 }} />}
              </Box>
              <Typography component="span" noWrap sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 220, fontSize: '14px', fontWeight: 600 }}>
                {displayName}
              </Typography>
              <Button onClick={handleLogout} sx={{ minHeight: 36, py: 0, px: 1.25, minWidth: 0, borderRadius: '8px', color: modernColors.gray[600], fontSize: '13px', fontWeight: 600 }}>
                {t('cabinet.logout')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1280, mx: 'auto', boxSizing: 'border-box', px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3.5 }, pb: { xs: 3, sm: 8 }, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
        <Box
          component="nav"
          aria-label={t('cabinet.sections')}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: '1 1 240px',
            maxWidth: 280,
            minWidth: 0,
            boxSizing: 'border-box',
            p: 1.5,
            flexDirection: 'column',
            gap: 0.5,
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[200]}`,
            borderRadius: '16px',
          }}
        >
          {!hasProfile ? (
            <>
              <Box sx={{ minHeight: 48, px: 1.5, borderRadius: '10px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                {t('cabinet.add_profile')}
              </Box>
              {NAV.filter((item) => !['nav_home', 'nav_profile'].includes(item.key)).map((item) => (
                <Box key={item.key} aria-disabled sx={{ minHeight: 48, px: 1.5, color: modernColors.gray[400], fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {t(`cabinet.${item.key}`)}
                  <LockIcon sx={{ fontSize: 16 }} />
                </Box>
              ))}
              <Typography sx={{ m: 0, px: 1.5, pt: 1, fontSize: '12px', lineHeight: 1.5, color: modernColors.gray[500] }}>{t('cabinet.locked_hint')}</Typography>
            </>
          ) : (
            <>
              {NAV.map((item) => (
                <Box
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  sx={{
                    position: 'relative',
                    minHeight: 48,
                    px: 1.5,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: modernColors.gray[700],
                    fontSize: '15px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    '&:hover': { backgroundColor: modernColors.gray[50] },
                    '&.active': {
                      backgroundColor: modernColors.primary[50],
                      color: modernColors.primary[600],
                      fontWeight: 700,
                      '&::before': { content: '""', position: 'absolute', left: 0, width: 4, height: 22, borderRadius: '2px', backgroundColor: modernColors.primary[600] },
                    },
                  }}
                >
                  {t(`cabinet.${item.key}`)}
                  {item.badge && pending > 0 && <Badge count={pending} />}
                </Box>
              ))}
              <Box sx={{ height: '1px', my: 1, backgroundColor: modernColors.gray[200] }} />
              <Button component={RouterLink} to="/" variant="contained" disableElevation startIcon={<AddIcon />} sx={{ minHeight: 48, py: 0, borderRadius: '10px', fontWeight: 600 }}>
                {t('cabinet.enroll')}
              </Button>
            </>
          )}
        </Box>

        <Box component="main" sx={{ flex: '999 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Outlet context={{ registrations, loading } as CabinetContext} />
        </Box>
      </Box>

      {hasProfile && (
        <Box
          component="nav"
          aria-label={t('cabinet.sections')}
          sx={{
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: modernColors.surface.primary,
            borderTop: `1px solid ${modernColors.gray[200]}`,
          }}
        >
          {NAV.filter((item) => item.mobile).map(({ to, key, Icon, badge }) => (
            <Box
              key={to}
              component={NavLink}
              to={to}
              sx={{
                position: 'relative',
                minHeight: 60,
                textDecoration: 'none',
                color: modernColors.gray[600],
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.25,
                textAlign: 'center',
                '&.active': { color: modernColors.primary[600] },
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
              <Box component="span" sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t(`cabinet.${key}_short`)}
              </Box>
              {badge && key === 'nav_payments' && pending > 0 && (
                <Box sx={{ position: 'absolute', top: 4, left: '50%', ml: 0.75 }}>
                  <Badge count={pending} small />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CabinetLayout;
