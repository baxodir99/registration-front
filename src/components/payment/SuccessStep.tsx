import React from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import { Check as CheckIcon, Download as DownloadIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { SUPPORT_PHONE_TEL } from '../../constants';
import { PaymentResponse } from '../../types';
import { formatMoney } from '../../utils/price';
import { modernColors, statusColors } from '../../theme/modernTheme';
import { SecondaryButton } from '../ui';

interface SuccessStepProps {
  paymentData: PaymentResponse;
  onDownload: () => void;
  onNewRegistration: () => void;
  finishLabel?: string;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ paymentData, onDownload, onNewRegistration, finishLabel }) => {
  const { t } = useTranslation();
  const cardSx = {
    backgroundColor: modernColors.surface.primary,
    border: `1px solid ${modernColors.gray[200]}`,
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 712, mx: 'auto', pt: { xs: 0, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box
        component="section"
        sx={{ ...cardSx, borderRadius: '20px', p: { xs: 3, sm: '40px 32px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}
      >
        <Box sx={{ width: 72, height: 72, borderRadius: '36px', backgroundColor: statusColors.success.dot, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '30px' }, fontWeight: 700 }}>
          {t('payment.card.success_title')}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '16px', color: modernColors.gray[600] }}>
          {t('payment.card.success_subtitle')}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 20px', fontSize: '14px', color: modernColors.gray[700] }}>
          <span>{t('payment.card.invoice_short')}: <Box component="strong" sx={{ color: modernColors.gray[900] }}>{paymentData.invoice}</Box></span>
          <span>{t('payment.card.amount_short')}: <Box component="strong" sx={{ color: modernColors.gray[900] }}>{formatMoney(paymentData.amount)} {t('payment.currency')}</Box></span>
          <Box component="span" sx={{ px: 1.25, py: 0.25, borderRadius: '10px', backgroundColor: statusColors.success.bg, color: statusColors.success.text, fontWeight: 600 }}>
            {t('payment.card.paid_badge')}
          </Box>
        </Box>
      </Box>

      {paymentData.info_doc && (
        <Box component="section" sx={{ ...cardSx, borderRadius: '16px', p: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.25 }}>
          <Box sx={{ width: 52, height: 62, borderRadius: '8px', backgroundColor: statusColors.error.bg, color: statusColors.error.text, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            PDF
          </Box>
          <Box sx={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography component="h2" sx={{ m: 0, fontSize: '17px', fontWeight: 700 }}>{t('payment.exam_info_title')}</Typography>
            <Typography sx={{ m: 0, fontSize: '14px', lineHeight: 1.5, color: modernColors.gray[600] }}>{t('payment.exam_info_note')}</Typography>
          </Box>
          <Button variant="contained" disableElevation onClick={onDownload} startIcon={<DownloadIcon />} sx={{ minHeight: 52, py: 0, px: 2.5, borderRadius: '12px', fontSize: '15px', fontWeight: 600 }}>
            {t('common.download')}
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', p: '14px 16px', borderRadius: '12px', backgroundColor: modernColors.primary[50], fontSize: '14px', lineHeight: 1.5 }}>
        <InfoIcon sx={{ fontSize: 20, mt: '1px', color: modernColors.primary[600] }} />
        <span>
          {t('payment.card.success_note')}{' '}
          <Link href={`tel:${SUPPORT_PHONE_TEL}`} sx={{ fontWeight: 600 }}>(95) 515-68-68</Link>
          <br />
          {t('payment.cabinet_hint')}{' '}
          <Link component={RouterLink} to="/kabinet" sx={{ fontWeight: 600 }}>{t('payment.cabinet_link')}</Link>
        </span>
      </Box>

      <SecondaryButton onClick={onNewRegistration} sx={{ alignSelf: 'center', minHeight: 48, fontSize: '15px' }}>
        {finishLabel || t('payment.new_registration')}
      </SecondaryButton>
    </Box>
  );
};

export default SuccessStep;
