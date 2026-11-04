import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { PaymentResponse, FormData } from '../types';
import { SectionCard, StepLayout } from './ui';
import InvoiceSummary, { PaymentDetails } from './payment/InvoiceSummary';
import { apiService } from '../services/api';
import { VALIDATION } from '../constants';
import SubStepper, { SubStep } from './payment/SubStepper';
import CardStep from './payment/CardStep';
import OtpStep from './payment/OtpStep';
import SuccessStep from './payment/SuccessStep';
import CheckoutRedirectStep from './payment/CheckoutRedirectStep';

interface PaymentStepProps extends PaymentDetails {
  paymentData: PaymentResponse;
  onNewRegistration: () => void;
  formData?: FormData;
  originalAmount?: number;
  onSubStepChange: (subStep: SubStep) => void;
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
  onSubStepChange,
  ...details
}) => {
  const hasDiscount =
    Boolean(formData?.promocodeData) &&
    originalAmount !== undefined &&
    originalAmount > Number(paymentData.amount);

  // Gateways like Birdarcha / VIA return a pay_url for external checkout.
  // ATMOS flow returns no pay_url — we collect the card inside the app.
  if (paymentData.pay_url) {
    return (
      <CheckoutRedirectStep
        paymentData={paymentData}
        originalAmount={originalAmount}
        hasDiscount={hasDiscount}
        onNewRegistration={onNewRegistration}
        {...details}
      />
    );
  }

  return (
    <AtmosCardFlow
      paymentData={paymentData}
      originalAmount={originalAmount}
      hasDiscount={hasDiscount}
      onNewRegistration={onNewRegistration}
      onSubStepChange={onSubStepChange}
      details={details}
    />
  );
};

interface AtmosCardFlowProps {
  paymentData: PaymentResponse;
  originalAmount?: number;
  hasDiscount: boolean;
  onNewRegistration: () => void;
  onSubStepChange: (subStep: SubStep) => void;
  details: PaymentDetails;
}

const AtmosCardFlow: React.FC<AtmosCardFlowProps> = ({
  paymentData,
  originalAmount,
  hasDiscount,
  onNewRegistration,
  onSubStepChange,
  details,
}) => {
  const { t } = useTranslation();
  const [subStep, setSubStep] = useState<SubStep>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
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
    onSubStepChange(subStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subStep]);

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

  if (subStep === 'success') {
    return (
      <SuccessStep
        paymentData={paymentData}
        onDownload={handleDownloadInfo}
        onNewRegistration={onNewRegistration}
      />
    );
  }

  return (
    <StepLayout
      aside={
        <InvoiceSummary
          paymentData={paymentData}
          originalAmount={originalAmount}
          hasDiscount={hasDiscount}
          compact={subStep === 'otp'}
          support={subStep === 'card'}
          {...details}
          deadline={undefined}
        />
      }
    >
      <SectionCard sx={{ gap: 2.75 }}>
        {subStep === 'card' && (
          <>
            <SubStepper current={subStep} />
            <CardStep
              cardNumber={cardNumber}
              setCardNumber={(v) => setCardNumber(formatCardNumber(v))}
              expiry={expiry}
              setExpiry={(v) => setExpiry(formatExpiry(v))}
              cardValid={cardValid}
              expiryValid={expiryValid}
              error={error}
              loading={loading}
              onSubmit={handleBindCard}
            />
          </>
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
            amount={Number(paymentData.amount)}
          />
        )}
      </SectionCard>
    </StepLayout>
  );
};

export default PaymentStep;
