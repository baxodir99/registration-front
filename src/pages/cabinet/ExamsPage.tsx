import React from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Box, Button, ButtonProps, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Registration, RegistrationStatus } from '../../services/auth';
import { dayjsLocale, dayMonth } from '../../utils/dates';
import { formatMoney } from '../../utils/price';
import { regionName } from '../../utils/regions';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { useCabinet } from './CabinetLayout';

export const STATUS_STYLE: Record<RegistrationStatus, { bg: string; text: string }> = {
  pending: { bg: statusColors.warning.bg, text: statusColors.warning.text },
  registered: { bg: statusColors.success.bg, text: statusColors.success.text },
  done: { bg: statusColors.info.bg, text: statusColors.info.text },
  expired: { bg: modernColors.gray[50], text: modernColors.gray[600] },
};

const FILTERS: (RegistrationStatus | 'all')[] = ['all', 'pending', 'registered', 'done', 'expired'];

const actionSx = { minHeight: 44, py: 0, px: 2, borderRadius: '10px', fontWeight: 600, fontSize: '14px' };

const Action: React.FC<ButtonProps & { to?: string; primary?: boolean; target?: string; rel?: string }> = ({ to, primary, children, ...props }) => (
  <Button
    {...(to ? { component: RouterLink, to } : {})}
    {...props}
    variant={primary ? 'contained' : 'outlined'}
    disableElevation
    sx={{ ...actionSx, ...(primary ? {} : { color: modernColors.gray[900], borderColor: modernColors.gray[300] }) } as object}
  >
    {children}
  </Button>
);

const ExamCard: React.FC<{ row: Registration }> = ({ row }) => {
  const { t, i18n } = useTranslation();
  const date = row.date ? dayjs(row.date).locale(dayjsLocale(i18n.language)) : null;
  const style = STATUS_STYLE[row.status];
  const currency = t('payment.currency');

  return (
    <Box component="article" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 }, borderRadius: '16px', backgroundColor: '#FFFFFF', border: `1px solid ${modernColors.gray[200]}` }}>
      <Box sx={{ width: 64, flexShrink: 0, py: 1, borderRadius: '12px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="span" sx={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.1 }}>{date ? date.date() : '—'}</Box>
        <Box component="span" sx={{ fontSize: '12px', fontWeight: 600 }}>{date ? date.format('MMM') : ''}</Box>
      </Box>
      <Box sx={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography component="h3" sx={{ m: 0, fontSize: '16px', fontWeight: 700, overflowWrap: 'anywhere' }}>{row.exam}</Typography>
        <Typography component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>
          {[regionName(t, row.region), `${formatMoney(row.amount)} ${currency}`].filter(Boolean).join(' · ')}
        </Typography>
        {row.status === 'pending' && row.deadline && (
          <Typography component="span" sx={{ fontSize: '13px', color: statusColors.warning.text }}>
            {t('cabinet.pay_until', { date: dayMonth(row.deadline, i18n.language) })}
          </Typography>
        )}
      </Box>
      <Box component="span" sx={{ px: 1.25, py: 0.5, borderRadius: '10px', fontSize: '13px', fontWeight: 600, backgroundColor: style.bg, color: style.text, whiteSpace: 'nowrap' }}>
        {t(`cabinet.status_${row.status}`)}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {row.status === 'pending' && <Action primary to={`/tolov/${row.invoice}`}>{t('cabinet.pay')}</Action>}
        {row.status === 'registered' && row.info_doc_url && (
          <Action href={row.info_doc_url} target="_blank" rel="noopener noreferrer">{t('cabinet.info_doc')}</Action>
        )}
        {row.status === 'done' && row.has_result && <Action to="/kabinet/natijalar">{t('cabinet.see_result')}</Action>}
        {row.status === 'done' && row.has_certificate && <Action to="/kabinet/sertifikatlar">{t('cabinet.certificate')}</Action>}
        {row.status === 'expired' && <Action to="/">{t('cabinet.retry')}</Action>}
      </Box>
    </Box>
  );
};

const ExamsPage: React.FC = () => {
  const { t } = useTranslation();
  const { registrations, loading } = useCabinet();
  const [params, setParams] = useSearchParams();
  const current = (params.get('holat') || 'all') as RegistrationStatus | 'all';

  const count = (filter: RegistrationStatus | 'all') =>
    filter === 'all' ? registrations.length : registrations.filter((row) => row.status === filter).length;
  const rows = current === 'all' ? registrations : registrations.filter((row) => row.status === current);

  return (
    <>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>{t('cabinet.nav_exams')}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {FILTERS.map((filter) => {
          const active = filter === current;
          return (
            <Button
              key={filter}
              aria-pressed={active}
              onClick={() => setParams(filter === 'all' ? {} : { holat: filter })}
              sx={{
                minHeight: 44,
                py: 0,
                px: 1.75,
                borderRadius: '22px',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 600,
                border: `1px solid ${active ? modernColors.primary[600] : modernColors.gray[300]}`,
                backgroundColor: active ? modernColors.primary[600] : '#FFFFFF',
                color: active ? '#FFFFFF' : modernColors.gray[700],
                '&:hover': { backgroundColor: active ? modernColors.primary[700] : modernColors.gray[50] },
              }}
            >
              {t(filter === 'all' ? 'cabinet.filter_all' : `cabinet.status_${filter}`)} · {count(filter)}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {rows.map((row) => <ExamCard key={row.id} row={row} />)}
        {!loading && rows.length === 0 && (
          <Typography sx={{ m: 0, py: 4, textAlign: 'center', fontSize: '15px', color: modernColors.gray[600] }}>{t('cabinet.no_exams')}</Typography>
        )}
      </Box>
    </>
  );
};

export default ExamsPage;
