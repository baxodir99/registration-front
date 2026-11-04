import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PaymentStep from '../components/PaymentStep';
import { Notice, SecondaryButton } from '../components/ui';
import { AppHeader, MainLayout } from '../components/layout';
import { authApi, PaymentDetail } from '../services/auth';
import { FormStep } from '../types';
import { formatDate } from '../utils/validation';

/** Kabinetdan to'lash: billing -> tashqi sahifa, ATMOS -> karta (yo'lni faqat pay_url belgilaydi) */
const PayInvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoice } = useParams();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    authApi.paymentDetail(invoice || '').then(setPayment).catch(() => setFailed(true));
  }, [invoice]);

  const toCabinet = () => navigate('/kabinet');

  return (
    <>
      <AppHeader currentStep={FormStep.PAYMENT} onOpenResetDialog={() => undefined} />
      <MainLayout>
        {!payment && !failed && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {failed && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <Notice kind="error">{t('cabinet.payment_not_found')}</Notice>
            <SecondaryButton onClick={toCabinet}>{t('cabinet.back_to_cabinet')}</SecondaryButton>
          </Box>
        )}
        {payment && (
          <PaymentStep
            paymentData={payment}
            onNewRegistration={toCabinet}
            finishLabel={t('cabinet.back_to_cabinet')}
            onSubStepChange={() => undefined}
            examLabel={payment.exam || undefined}
            dateLabel={payment.date ? formatDate(payment.date) : undefined}
            participant={payment.full_name}
            deadline={payment.deadline ? formatDate(payment.deadline) : undefined}
          />
        )}
      </MainLayout>
    </>
  );
};

export default PayInvoicePage;
