import React, { useEffect, useMemo, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { PaymentResponse, FormData } from '../types';
import { apiService } from '../services/api';
import { VALIDATION } from '../constants';
import SubStepper, { SubStep } from './payment/SubStepper';
import CardStep from './payment/CardStep';
import OtpStep from './payment/OtpStep';
import SuccessStep from './payment/SuccessStep';
import CheckoutRedirectStep from './payment/CheckoutRedirectStep';

interface PaymentStepProps {
  paymentData: PaymentResponse;
  onNewRegistration: () => void;
  formData?: FormData;
  originalAmount?: number;
}

const RESEND_COOLDOWN = 60;

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, VALIDATION.CARD_LENGTH);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentData,
  onNewRegistration,
  formData,
  originalAmount,
}) => {
  const hasDiscount =
    Boolean(formData?.promocodeData) &&
    originalAmount !== undefined &&
    originalAmount > paymentData.amount;

  // Gateways like Birdarcha / VIA return a pay_url for external checkout.
  // ATMOS flow returns no pay_url — we collect the card inside the app.
  if (paymentData.pay_url) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 980,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <CheckoutRedirectStep
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
          onNewRegistration={onNewRegistration}
        />
      </Box>
    );
  }

  return (
    <AtmosCardFlow
      paymentData={paymentData}
      originalAmount={originalAmount}
      hasDiscount={hasDiscount}
      onNewRegistration={onNewRegistration}
    />
  );
};

interface AtmosCardFlowProps {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onNewRegistration: () => void;
}

const AtmosCardFlow: React.FC<AtmosCardFlowProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onNewRegistration,
}) => {
  const { t } = useTranslation();
  const [subStep, setSubStep] = useState<SubStep>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardFocus, setCardFocus] = useState<'number' | 'expiry' | null>(null);
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const cardDigits = useMemo(() => cardNumber.replace(/\s/g, ''), [cardNumber]);
  const cardValid = cardDigits.length === VALIDATION.CARD_LENGTH;
  const expiryValid = VALIDATION.EXPIRY_PATTERN.test(expiry);
  const otpValid = otp.length === VALIDATION.OTP_LENGTH;

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setInterval(() => {
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendIn]);

  const callBindCard = async (): Promise<string> => {
    const [mm, yy] = expiry.split('/');
    const response = await apiService.bindCard({
      card_number: cardDigits,
      expiry: `${yy}${mm}`,
    });
    if (
      response.status === 1 &&
      response.transaction_id &&
      response.transaction_id !== 'null'
    ) {
      return response.transaction_id;
    }
    throw new Error(response.message || t('payment.card.bind_failed'));
  };

  const handleBindCard = async () => {
    if (!cardValid || !expiryValid) return;
    setLoading(true);
    setError(null);
    try {
      const tid = await callBindCard();
      setTransactionId(tid);
      setOtp('');
      setSubStep('otp');
      setResendIn(RESEND_COOLDOWN);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t('payment.card.bind_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const tid = await callBindCard();
      setTransactionId(tid);
      setOtp('');
      setResendIn(RESEND_COOLDOWN);
      toast.info(t('payment.card.resend'));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t('payment.card.bind_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndPay = async () => {
    if (!otpValid || !transactionId) return;
    setLoading(true);
    setError(null);
    try {
      const confirmResp = await apiService.confirmBindCard({
        transaction_id: transactionId,
        otp,
        invoice: paymentData.invoice,
      });
      if (confirmResp.status !== 1) {
        setError(confirmResp.message || t('payment.card.otp_failed'));
        return;
      }
      const payResp = await apiService.chargeCard({
        invoice: paymentData.invoice,
      });
      if (payResp.status === 1) {
        toast.success(t('payment.card.success_toast'));
        setSubStep('success');
      } else {
        setError(payResp.message || t('payment.card.charge_failed'));
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t('payment.card.charge_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCard = () => {
    setSubStep('card');
    setOtp('');
    setTransactionId(null);
    setError(null);
  };

  const handleDownloadInfo = () => {
    if (!paymentData.info_doc) return;
    const link = document.createElement('a');
    link.href = paymentData.info_doc;
    link.download = `imtihon_malumoti_${paymentData.invoice}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 980,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <SubStepper current={subStep} />

      <Fade in key={subStep} timeout={250}>
        <Box>
          {subStep === 'card' && (
            <CardStep
              cardNumber={cardNumber}
              setCardNumber={(v) => setCardNumber(formatCardNumber(v))}
              expiry={expiry}
              setExpiry={(v) => setExpiry(formatExpiry(v))}
              cardFocus={cardFocus}
              setCardFocus={setCardFocus}
              cardValid={cardValid}
              expiryValid={expiryValid}
              error={error}
              loading={loading}
              onSubmit={handleBindCard}
              paymentData={paymentData}
              originalAmount={originalAmount}
              hasDiscount={hasDiscount}
            />
          )}
          {subStep === 'otp' && (
            <OtpStep
              otp={otp}
              setOtp={setOtp}
              last4={cardDigits.slice(-4)}
              error={error}
              loading={loading}
              onConfirm={handleConfirmAndPay}
              onBack={handleBackToCard}
              onResend={handleResend}
              resendIn={resendIn}
              otpValid={otpValid}
              paymentData={paymentData}
              originalAmount={originalAmount}
              hasDiscount={hasDiscount}
            />
          )}
          {subStep === 'success' && (
            <SuccessStep
              paymentData={paymentData}
              originalAmount={originalAmount}
              hasDiscount={hasDiscount}
              onDownload={handleDownloadInfo}
              onNewRegistration={onNewRegistration}
            />
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default PaymentStep;
