import React from 'react';
import { Box, Button, IconButton, Typography, useMediaQuery } from '@mui/material';
import { ChevronLeft as PrevIcon, ChevronRight as NextIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CardTitle, Notice, SectionCard } from './ui';
import { dayMonth, monthLabel, monthName } from '../utils/dates';
import { modernColors, statusColors } from '../theme/modernTheme';
import { ExamDate } from '../types';

type DayStatus = 'available' | 'half' | 'full' | 'not_open';

/** Sana ko'rinadi, lekin ro'yxat ochilmaguncha tanlab bo'lmaydi (backend ham rad etadi) */
export const dateStatus = (examDate: ExamDate): DayStatus => {
  if (examDate.regstration_open && dayjs(examDate.regstration_open).isAfter(dayjs(), 'day')) {
    return 'not_open';
  }
  return examDate.availability_status;
};

const isOpen = (examDate: ExamDate) => {
  const status = dateStatus(examDate);
  return (status === 'available' || status === 'half') && !dayjs(examDate.date).isBefore(dayjs(), 'day');
};

const DAY_STYLE: Record<'available' | 'half', { bg: string; border: string; text: string }> = {
  available: statusColors.success,
  half: statusColors.warning,
};

const LEGEND: { key: string; color: string }[] = [
  { key: 'legend_available', color: statusColors.success.dot },
  { key: 'legend_half', color: statusColors.warning.dot },
  { key: 'legend_full', color: statusColors.error.dot },
  { key: 'legend_none', color: modernColors.gray[200] },
];

interface ExamCalendarProps {
  examDates: ExamDate[];
  selectedId?: number;
  ready: boolean;
  loading: boolean;
  failed: boolean;
  month: Dayjs;
  onMonthChange: (month: Dayjs) => void;
  onSelect: (examDate: ExamDate) => void;
}

const ExamCalendar: React.FC<ExamCalendarProps> = ({
  examDates,
  selectedId,
  ready,
  loading,
  failed,
  month,
  onMonthChange,
  onSelect,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const isMobile = useMediaQuery('(max-width:600px)');
  const key = (name: string): string => t(`exam_selection.${name}`);

  const firstMonth = dayjs().startOf('month');
  const lastDate = examDates.reduce(
    (latest, examDate) => (dayjs(examDate.date).isAfter(latest) ? dayjs(examDate.date) : latest),
    firstMonth.add(6, 'month')
  );
  const lastMonth = lastDate.startOf('month');

  const openDates = examDates.filter(isOpen);
  const nextCount = openDates.filter((d) => dayjs(d.date).isAfter(month, 'month')).length;
  const prevCount = openDates.filter((d) => dayjs(d.date).isBefore(month, 'month')).length;
  const thisCount = openDates.length - nextCount - prevCount;
  const firstNext = openDates
    .map((d) => dayjs(d.date))
    .filter((d) => d.isAfter(month, 'month'))
    .sort((a, b) => a.valueOf() - b.valueOf())[0];

  const offset = (month.startOf('month').day() + 6) % 7; // dushanbadan
  const days = Array.from({ length: month.daysInMonth() }, (_, i) => month.date(i + 1));

  const arrow = (direction: 'prev' | 'next') => {
    const count = direction === 'prev' ? prevCount : nextCount;
    const disabled = direction === 'prev' ? !month.isAfter(firstMonth, 'month') : !month.isBefore(lastMonth, 'month');
    const Icon = direction === 'prev' ? PrevIcon : NextIcon;
    const label = key(direction === 'prev' ? 'prev_month_aria' : 'next_month_aria');
    return (
      <IconButton
        onClick={() => onMonthChange(direction === 'prev' ? month.subtract(1, 'month') : month.add(1, 'month'))}
        disabled={disabled}
        aria-label={count ? `${label}, ${t('exam_selection.month_badge_aria', { count })}` : label}
        sx={{
          position: 'relative',
          width: 44,
          height: 44,
          overflow: 'visible',
          color: modernColors.gray[900],
          border: { xs: 0, sm: `1px solid ${modernColors.gray[200]}` },
          borderRadius: '10px',
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
        {count > 0 && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -8,
              [direction === 'prev' ? 'left' : 'right']: -8,
              minWidth: 22,
              height: 22,
              px: '6px',
              boxSizing: 'border-box',
              borderRadius: '11px',
              border: '2px solid #FFFFFF',
              backgroundColor: statusColors.badge,
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {count}
          </Box>
        )}
      </IconButton>
    );
  };

  const cellSx = {
    height: { xs: 44, sm: 60 },
    boxSizing: 'border-box',
    borderRadius: { xs: '8px', sm: '10px' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    minWidth: 0,
  } as const;
  const number = { fontSize: { xs: '14px', sm: '15px' }, fontWeight: 600, lineHeight: 1.2 } as const;
  const tag = { display: { xs: 'none', sm: 'block' }, fontSize: '11px', fontWeight: 600, lineHeight: 1.2 } as const;

  const renderDay = (day: Dayjs) => {
    const examDate = examDates.find((d) => dayjs(d.date).isSame(day, 'day'));
    const past = day.isBefore(dayjs(), 'day');
    const name = dayMonth(day, language);

    if (!examDate || past) {
      return (
        <Box key={day.date()} aria-label={`${name}, ${key('aria_none')}`} sx={{ ...cellSx, color: '#8A9894', fontSize: { xs: '14px', sm: '15px' } }}>
          {day.date()}
        </Box>
      );
    }

    const status = dateStatus(examDate);
    if (status === 'full') {
      return (
        <Box key={day.date()} aria-label={`${name}, ${key('aria_full')}`} sx={{ ...cellSx, backgroundColor: statusColors.error.bg, color: statusColors.error.text }}>
          <Box component="span" sx={{ ...number, textDecoration: 'line-through' }}>{day.date()}</Box>
          <Box component="span" sx={tag}>{key('full_short')}</Box>
        </Box>
      );
    }
    if (status === 'not_open') {
      return (
        <Box key={day.date()} aria-label={`${name}, ${key('aria_not_open')}`} sx={{ ...cellSx, backgroundColor: modernColors.gray[50], color: modernColors.gray[600] }}>
          <Box component="span" sx={number}>{day.date()}</Box>
          <Box component="span" sx={tag}>{key('not_open_short')}</Box>
        </Box>
      );
    }

    const selected = examDate.id === selectedId;
    const style = DAY_STYLE[status];
    return (
      <Button
        key={day.date()}
        onClick={() => onSelect(examDate)}
        aria-pressed={selected}
        aria-label={`${name}, ${key(status === 'available' ? 'aria_available' : 'aria_half')}`}
        sx={{
          ...cellSx,
          p: 0,
          minHeight: 0,
          minWidth: 0,
          fontFamily: 'inherit',
          border: `1px solid ${selected ? modernColors.primary[600] : style.border}`,
          backgroundColor: selected ? modernColors.primary[600] : style.bg,
          color: selected ? '#FFFFFF' : modernColors.gray[900],
          '&:hover': { backgroundColor: selected ? modernColors.primary[700] : style.bg, borderColor: modernColors.primary[600] },
        }}
      >
        <Box component="span" sx={{ ...number, fontWeight: selected ? 700 : 600 }}>{day.date()}</Box>
        <Box component="span" sx={{ ...tag, color: selected ? '#FFFFFF' : style.text }}>
          {key(selected ? 'selected_short' : status === 'available' ? 'available_short' : 'half_short')}
        </Box>
      </Button>
    );
  };

  return (
    <SectionCard>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
        <CardTitle>{isMobile ? key('date_title_short') : key('date_title')}</CardTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {arrow('prev')}
          <Typography aria-live="polite" sx={{ minWidth: { xs: 100, sm: 132 }, textAlign: 'center', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 600 }}>
            {monthLabel(month, language)}
          </Typography>
          {arrow('next')}
        </Box>
      </Box>

      {ready && !loading && !failed && thisCount === 0 && nextCount > 0 && firstNext && (
        <Notice
          kind="warning"
          action={
            <Button
              variant="contained"
              disableElevation
              onClick={() => onMonthChange(firstNext.startOf('month'))}
              sx={{ minHeight: 44, py: 0, px: 2, borderRadius: '10px', fontWeight: 600 }}
            >
              {t('exam_selection.go_to_month', { month: monthName(firstNext, language) })} →
            </Button>
          }
        >
          {t('exam_selection.no_dates_this_month', { month: monthName(month, language) })}{' '}
          <strong>{t('exam_selection.later_open_dates', { count: nextCount })}</strong>
        </Notice>
      )}

      {ready && !loading && !failed && openDates.length === 0 && <Notice>{key('no_dates_soon')}</Notice>}
      {!ready && <Notice>{key('choose_first')}</Notice>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 }, fontSize: { xs: '12px', sm: '13px' }, color: modernColors.gray[700] }}>
        {LEGEND.map((item) => (
          <Box component="span" key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box component="span" sx={{ width: 10, height: 10, borderRadius: '5px', backgroundColor: item.color }} />
            {key(item.key)}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: { xs: 0.5, sm: 0.75 }, opacity: loading ? 0.5 : 1 }}>
        {key('weekdays').split(',').map((name) => (
          <Box key={name} sx={{ textAlign: 'center', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 600, color: modernColors.gray[500], py: 0.75 }}>
            {name}
          </Box>
        ))}
        {Array.from({ length: offset }, (_, i) => <div key={`blank-${i}`} />)}
        {days.map(renderDay)}
      </Box>

      {ready && !isMobile && thisCount > 0 && <Notice>{key('arrow_tip')}</Notice>}
    </SectionCard>
  );
};

export default ExamCalendar;
