import React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface OrgNameProps {
  /** Ikkala qatorga bir xil */
  lineSx: SxProps<Theme>;
  /** Tor ekranda faqat markaz nomi qoladi */
  compact?: boolean;
}

/** O'zbek va qoraqalpoq tilida "... huzuridagi" nomdan oldin keladi, ru/en da keyin */
const OrgName: React.FC<OrgNameProps> = ({ lineSx, compact }) => {
  const { t, i18n } = useTranslation();
  const parentFirst = !['ru', 'en'].includes(i18n.language);
  const name = <Typography key="name" sx={lineSx}>{t('header.org_name')}</Typography>;
  const parent = (
    <Typography key="parent" sx={[{ display: compact ? { xs: 'none', lg: 'block' } : 'block' }, ...(Array.isArray(lineSx) ? lineSx : [lineSx])]}>
      {t('header.org_parent')}
    </Typography>
  );

  return <Box sx={{ minWidth: 0 }}>{parentFirst ? [parent, name] : [name, parent]}</Box>;
};

export default OrgName;
