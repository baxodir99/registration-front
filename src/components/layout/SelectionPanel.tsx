import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { longDate } from '../../utils/dates';
import { regionName } from '../../utils/regions';
import { discountedAmount, formatMoney } from '../../utils/price';
import { Exam, ExamDate, ExamName, FormData, Region } from '../../types';
import { AsideCard, CardTitle, Divider, InfoItem, TextLink, TotalRow } from '../ui';

interface SelectionPanelProps {
  formData: Partial<FormData>;
  examNames: ExamName[];
  regions: Region[];
  exams: Exam[];
  examDates: ExamDate[];
  onChange: () => void;
}

/** 2-bosqich yon paneli: tanlangan imtihon, hudud, sana va summa */
const SelectionPanel: React.FC<SelectionPanelProps> = ({ formData, examNames, regions, exams, examDates, onChange }) => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const exam = exams.find((e) => e.id === formData.exam);
  const examDate = examDates.find((ed) => ed.id === formData.examDate);
  const name = exam?.name || examNames.find((en) => en.id === formData.examName)?.name;
  const final = exam ? discountedAmount(parseFloat(exam.amount), formData.promocodeData) : null;

  return (
    <AsideCard gap={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <CardTitle size={18}>{t('exam_selection.your_choice_short')}</CardTitle>
        <TextLink onClick={onChange}>{t('exam_selection.change')}</TextLink>
      </Box>
      <Box sx={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', flexDirection: 'column', gap: 1.5 }}>
        <InfoItem strong label={t('exam_selection.summary_exam')} value={name} />
        <InfoItem label={t('exam_selection.summary_region')} value={regionName(t, regions.find((r) => r.id === formData.region)?.name)} />
        <InfoItem label={t('exam_selection.summary_date')} value={examDate ? longDate(examDate.date, i18n.language) : undefined} />
      </Box>
      <Divider />
      {final !== null && (
        <TotalRow label={t('exam_selection.total')} value={`${formatMoney(final)} ${t('payment.currency')}`} size={20} />
      )}
    </AsideCard>
  );
};

export default SelectionPanel;
