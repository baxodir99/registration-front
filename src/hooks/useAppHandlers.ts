import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { storageService } from '../utils/storage';
import { FormData, FormStep, PaymentResponse } from '../types';

interface UseAppHandlersProps {
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  formData: Partial<FormData>;
  setFormData: (data: Partial<FormData>) => void;
  setPaymentData: (data: PaymentResponse | null) => void;
  setResetDialogOpen: (open: boolean) => void;
  loadExams: (examNameId: number, typeId?: number) => Promise<any[]>;
  loadExamDates: (examId: number, regionId: number) => Promise<any[]>;
}

export const useAppHandlers = ({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  setPaymentData,
  setResetDialogOpen,
  loadExams,
  loadExamDates,
}: UseAppHandlersProps) => {
  const handleNext = async (stepData: Partial<FormData> | { paymentData: PaymentResponse }) => {
    if ('paymentData' in stepData) {
      // Payment step
      setPaymentData(stepData.paymentData);
      setCurrentStep(FormStep.PAYMENT);
    } else {
      // Regular form step
      const newFormData = { ...formData, ...stepData };
      setFormData(newFormData);

      // Load additional data if needed
      if (currentStep === FormStep.EXAM_SELECTION) {
        if (stepData.examName && stepData.type) {
          await loadExams(stepData.examName, stepData.type);
        } else if (stepData.examName) {
          await loadExams(stepData.examName);
        }

        if (stepData.exam && stepData.region) {
          await loadExamDates(stepData.exam, stepData.region);
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > FormStep.EXAM_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = useCallback(
    (stepData: Partial<FormData>) => {
      setFormData({ ...formData, ...stepData });
    },
    [formData, setFormData]
  );

  const handleNewRegistration = () => {
    setCurrentStep(FormStep.EXAM_SELECTION);
    setFormData({});
    setPaymentData(null);
    storageService.clearAll();
    toast.info("Yangi ro'yxatdan o'tish boshlandi");
  };

  const handleResetData = () => {
    setResetDialogOpen(false);
    setCurrentStep(FormStep.EXAM_SELECTION);
    setFormData({});
    setPaymentData(null);
    storageService.clearAll();
    toast.info("Ma'lumotlar tozalandi. Qaytadan boshlashingiz mumkin");
  };

  const handleOpenResetDialog = () => {
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };

  return {
    handleNext,
    handlePrevious,
    handleDataChange,
    handleNewRegistration,
    handleResetData,
    handleOpenResetDialog,
    handleCloseResetDialog,
  };
};
