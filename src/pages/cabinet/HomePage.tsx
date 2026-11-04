import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Link, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CardTitle, SectionCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { authApi, OpenExam } from '../../services/auth';
import { dayMonth } from '../../utils/dates';
import { formatMoney } from '../../utils/price';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { useCabinet } from './CabinetLayout';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registrations } = useCabinet();
  const [counts, setCounts] = useState({ results: 0, certificates: 0 });
  const [openExams, setOpenExams] = useState<OpenExam[]>([]);

  useEffect(() => {
    authApi
      .results()
      .then((data) =>
        setCounts((c) => ({ ...c, results: data.more_part_data.length + data.math_subject_data.length + data.to_subject_data.length }))
      )
      .catch(() => undefined);
    authApi
      .certificates()
      .then((data) => setCounts((c) => ({ ...c, certificates: data.length })))
      .catch(() => undefined);
    authApi.openExams().then(setOpenExams).catch(() => undefined);
  }, []);

  const pending = registrations
    .filter((row) => row.status === 'pending')
    .sort((a, b) => dayjs(a.deadline || a.date).valueOf() - dayjs(b.deadline || b.date).valueOf());
  const nearest = pending[0];
  const registered = registrations.filter((row) => row.status === 'registered').length;
  const currency = t('payment.currency');
  const daysLeft = nearest?.deadline ? dayjs(nearest.deadline).startOf('day').diff(dayjs().startOf('day'), 'day') : null;

  const tiles = [
    { label: t('cabinet.tile_upcoming'), value: registered, to: '/kabinet/imtihonlar?holat=registered', warn: false },
    { label: t('cabinet.tile_pending'), value: pending.length, to: '/kabinet/imtihonlar?holat=pending', warn: pending.length > 0 },
    { label: t('cabinet.tile_results'), value: counts.results, to: '/kabinet/natijalar', warn: false },
    { label: t('cabinet.tile_certificates'), value: counts.certificates, to: '/kabinet/sertifikatlar', warn: false },
  ];

  const availability = {
    available: { text: t('exam_selection.legend_available'), color: statusColors.success.text },
    half: { text: t('exam_selection.legend_half'), color: statusColors.warning.text },
    full: { text: t('exam_selection.legend_full'), color: statusColors.error.text },
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>
          {t('cabinet.hello', { name: user?.profile?.first_name || '' })}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '15px', color: modernColors.gray[600] }}>{t('cabinet.hello_sub')}</Typography>
      </Box>

      {nearest && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.75, p: '18px 20px', borderRadius: '16px', backgroundColor: statusColors.warning.bg, border: `1px solid ${statusColors.warning.border}`, color: '#5C3B08' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
            <Typography component="span" sx={{ fontSize: '16px', fontWeight: 700 }}>
              {t('cabinet.pending_banner', { exam: nearest.exam })}
            </Typography>
            {nearest.deadline && daysLeft !== null && (
              <Typography component="span" sx={{ fontSize: '14px' }}>
                {t('cabinet.pending_until', { date: dayMonth(nearest.deadline, i18n.language), days: daysLeft })}
              </Typography>
            )}
          </Box>
          <Button component={RouterLink} to={`/tolov/${nearest.invoice}`} variant="contained" disableElevation sx={{ minHeight: 48, py: 0, px: 2.5, borderRadius: '12px', fontSize: '15px', fontWeight: 600 }}>
            {t('payment.redirect.pay_amount', { amount: formatMoney(nearest.amount), currency })}
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
        {tiles.map((tile) => (
          <Box
            key={tile.to}
            component="button"
            type="button"
            onClick={() => navigate(tile.to)}
            sx={{
              textAlign: 'left',
              p: 2.25,
              borderRadius: '14px',
              border: `1px solid ${tile.warn ? statusColors.warning.border : modernColors.gray[200]}`,
              backgroundColor: '#FFFFFF',
              color: modernColors.gray[900],
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              '&:hover': { borderColor: modernColors.primary[600] },
            }}
          >
            <Box component="span" sx={{ fontSize: '13px', color: modernColors.gray[600] }}>{tile.label}</Box>
            <Box component="span" sx={{ fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>{tile.value}</Box>
          </Box>
        ))}
      </Box>

      {openExams.length > 0 && (
        <SectionCard sx={{ p: { xs: 2, sm: 2.75 }, gap: 1.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <CardTitle size={18}>{t('cabinet.new_exams')}</CardTitle>
            <Link component={RouterLink} to="/" sx={{ minHeight: 44, display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>{t('cabinet.all')}</Link>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
            {openExams.map((exam) => {
              const state = availability[exam.availability_status];
              return (
                <Box key={exam.id} component={RouterLink} to="/" sx={{ p: 1.75, borderRadius: '12px', border: `1px solid ${modernColors.gray[200]}`, textDecoration: 'none', color: modernColors.gray[900], display: 'flex', flexDirection: 'column', gap: 0.5, '&:hover': { borderColor: modernColors.primary[600] } }}>
                  <Box component="span" sx={{ fontSize: '13px', fontWeight: 600, color: modernColors.gray[600] }}>{dayMonth(exam.date, i18n.language)}</Box>
                  <Box component="span" sx={{ fontSize: '15px', fontWeight: 600 }}>{exam.exam?.name || exam.examname}</Box>
                  <Box component="span" sx={{ fontSize: '13px', fontWeight: 600, color: state.color }}>{state.text}</Box>
                </Box>
              );
            })}
          </Box>
          <Typography sx={{ m: 0, fontSize: '13px', color: modernColors.gray[500] }}>{t('cabinet.enroll_hint')}</Typography>
        </SectionCard>
      )}
    </>
  );
};

export default HomePage;
