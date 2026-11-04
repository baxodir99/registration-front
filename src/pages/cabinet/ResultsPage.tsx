import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { authApi, Results } from '../../services/auth';
import { longDate } from '../../utils/dates';
import { modernColors } from '../../theme/modernTheme';

// Mock imtihonda har bir ko'nikma 75 ballik
const SKILL_MAX = 75;

interface Score {
  name: string;
  value: number;
  max?: number;
}

interface CardData {
  key: string;
  level: string | null;
  levelLabel: string;
  total: React.ReactNode;
  title: string;
  date: string;
  scores: Score[];
}

const ResultCard: React.FC<{ card: CardData }> = ({ card }) => (
  <Box component="article" sx={{ display: 'flex', flexWrap: 'wrap', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: `1px solid ${modernColors.gray[200]}` }}>
    <Box sx={{ flex: '1 1 160px', maxWidth: { sm: 200 }, boxSizing: 'border-box', p: 3, backgroundColor: modernColors.primary[50], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center' }}>
      <Box component="span" sx={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: modernColors.gray[600] }}>{card.levelLabel}</Box>
      <Box component="span" sx={{ fontSize: '44px', fontWeight: 700, lineHeight: 1.1, color: modernColors.primary[600] }}>{card.level || '—'}</Box>
      <Box component="span" sx={{ fontSize: '14px', color: modernColors.gray[700] }}>{card.total}</Box>
    </Box>
    <Box sx={{ flex: '999 1 300px', minWidth: 0, boxSizing: 'border-box', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Typography component="h2" sx={{ m: 0, fontSize: '18px', fontWeight: 700, overflowWrap: 'anywhere' }}>{card.title}</Typography>
        <Typography component="span" sx={{ fontSize: '14px', color: modernColors.gray[600] }}>{card.date}</Typography>
      </Box>
      {card.scores.map((score) => (
        <Box key={score.name} sx={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr) 40px', alignItems: 'center', gap: 1.5, fontSize: '14px' }}>
          <span>{score.name}</span>
          <Box sx={{ height: 8, borderRadius: '4px', backgroundColor: modernColors.gray[100], overflow: 'hidden' }}>
            {score.max && (
              <Box sx={{ height: 8, width: `${Math.min((score.value / score.max) * 100, 100)}%`, backgroundColor: modernColors.primary[600] }} />
            )}
          </Box>
          <Box component="span" sx={{ fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{score.value}</Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const ResultsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [results, setResults] = useState<Results | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    authApi.results().then(setResults).catch(() => setFailed(true));
  }, []);

  const exam = (examdate: { examname: string; exam: string; date: string }) => ({
    title: examdate.exam || examdate.examname,
    date: longDate(examdate.date, i18n.language),
  });

  const cards: CardData[] = results
    ? [
        ...results.more_part_data.map((row, i) => ({
          key: `more-${i}`,
          level: row.level_cefr,
          levelLabel: t('cabinet.cefr_level'),
          total: <>{t('cabinet.total')}: <strong>{row.score_total}</strong></>,
          ...exam(row.examdate),
          scores: [
            { name: 'Reading', value: row.score_r, max: SKILL_MAX },
            { name: 'Listening', value: row.score_l, max: SKILL_MAX },
            { name: 'Writing', value: row.score_w, max: SKILL_MAX },
            { name: 'Speaking', value: row.score_s, max: SKILL_MAX },
          ],
        })),
        ...results.to_subject_data.map((row, i) => ({
          key: `to-${i}`,
          level: row.level,
          levelLabel: t('cabinet.level'),
          total: <>{t('cabinet.total')}: <strong>{row.score_total}</strong> · {row.percent}%</>,
          ...exam(row.examdate),
          scores: [
            { name: t('cabinet.score_written'), value: row.score_e },
            { name: t('cabinet.score_test'), value: row.score_t },
          ],
        })),
        ...results.math_subject_data.map((row, i) => ({
          key: `math-${i}`,
          level: row.level,
          levelLabel: t('cabinet.level'),
          total: <>{row.percent}%</>,
          ...exam(row.examdate),
          scores: [
            { name: t('cabinet.score_math'), value: row.score_z },
            { name: t('cabinet.score_test'), value: row.score_t },
          ],
        })),
      ]
    : [];

  return (
    <>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>{t('cabinet.nav_results')}</Typography>
      {cards.map((card) => <ResultCard key={card.key} card={card} />)}
      {failed && <Typography sx={{ m: 0, fontSize: '15px' }}>{t('common.error')}</Typography>}
      {results && cards.length === 0 && (
        <Typography sx={{ m: 0, py: 4, textAlign: 'center', fontSize: '15px', color: modernColors.gray[600] }}>{t('cabinet.no_results')}</Typography>
      )}
    </>
  );
};

export default ResultsPage;
