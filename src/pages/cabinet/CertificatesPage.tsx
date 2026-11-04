import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { WorkspacePremiumOutlined as CertificateIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { authApi, Certificate } from '../../services/auth';
import { formatDateRange } from '../../utils/validation';
import { modernColors } from '../../theme/modernTheme';

const buttonSx = { minHeight: 44, py: 0, px: 2, borderRadius: '10px', fontSize: '14px', fontWeight: 600, flex: '1 1 auto' };

const CertificatesPage: React.FC = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Certificate[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    authApi.certificates().then(setRows).catch(() => setFailed(true));
  }, []);

  return (
    <>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>{t('cabinet.nav_certificates')}</Typography>
      {failed && <Typography sx={{ m: 0, fontSize: '15px' }}>{t('common.error')}</Typography>}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {rows?.map((row) => {
          const image = row.image_b64 ? `data:image/png;base64,${row.image_b64}` : '';
          return (
            <Box component="article" key={row.id} sx={{ p: 2.5, borderRadius: '16px', backgroundColor: '#FFFFFF', border: `1px solid ${modernColors.gray[200]}`, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              <Box aria-hidden sx={{ height: 120, borderRadius: '12px', backgroundColor: modernColors.primary[50], color: modernColors.primary[600], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <CertificateIcon sx={{ fontSize: 36 }} />
                <Box component="span" sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('cabinet.certificate')}</Box>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography component="h2" sx={{ m: 0, fontSize: '16px', fontWeight: 700, lineHeight: 1.35 }}>{row.examname}</Typography>
                {row.exam_start && row.exam_end && (
                  <Typography component="span" sx={{ fontSize: '13px', color: modernColors.gray[600] }}>
                    {t('cabinet.lesson_days')}: {formatDateRange(row.exam_start, row.exam_end)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {row.pdf_url && (
                  <>
                    <Button variant="outlined" href={row.pdf_url} target="_blank" rel="noopener noreferrer" sx={{ ...buttonSx, color: modernColors.gray[900], borderColor: modernColors.gray[300] }}>{t('cabinet.view')}</Button>
                    <Button variant="contained" disableElevation href={row.pdf_url} download sx={buttonSx}>{t('cabinet.download_pdf')}</Button>
                  </>
                )}
                {!row.pdf_url && image && (
                  <Button variant="contained" disableElevation href={image} download={`sertifikat-${row.id}.png`} sx={buttonSx}>{t('common.download')}</Button>
                )}
              </Box>
            </Box>
          );
        })}
        {rows && (
          <Box sx={{ minHeight: 160, p: 2.5, borderRadius: '16px', border: `1px dashed ${modernColors.gray[300]}`, color: modernColors.gray[600], fontSize: '14px', lineHeight: 1.5, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {t('cabinet.new_certificates_hint')}
          </Box>
        )}
      </Box>
    </>
  );
};

export default CertificatesPage;
