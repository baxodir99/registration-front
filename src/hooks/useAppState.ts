import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storage';
import { apiService } from '../services/api';
import { FormData, FormStep, Type, Region, ExamName, Exam, ExamDate, PaymentResponse } from '../types';

// Sahifa yangilanganda forma shu bosqichdan davom etadi. useState boshlang'ich qiymatida
// o'qiladi: effektda o'qilsa, StrictMode (npm start) effektlarni ikki marta ishlatadi va
// ikkinchi o'qishdan oldin "bosqichni saqlash" effekti 1-bosqichni yozib qo'ygan bo'ladi.
const savedState = (): { formData: Partial<FormData>; step: FormStep } => {
  const formData = storageService.getFormData();
  if (Object.keys(formData).length === 0) {
    return { formData, step: FormStep.EXAM_SELECTION };
  }
  const step = storageService.getCurrentStep();
  // paymentData saqlanmaydi: to'lov bosqichi tasdiqlashdan qayta ochiladi
  // (invoice-create shu odam va sanaga mavjud invoice ni qaytaradi)
  return { formData, step: step === FormStep.PAYMENT ? FormStep.CONFIRMATION : step };
};

export const useAppState = () => {
  const { t } = useTranslation();
  // Til almashganda boshlang'ich ma'lumotlar qayta yuklanmasin — t effekt bog'liqligiga kirmaydi
  const tRef = useRef(t);
  tRef.current = t;

  // State
  const [initial] = useState(savedState);
  const [currentStep, setCurrentStep] = useState<FormStep>(initial.step);
  const [formData, setFormData] = useState<Partial<FormData>>(initial.formData);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // API Data
  const [types, setTypes] = useState<Type[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [examNames, setExamNames] = useState<ExamName[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);

  // Boshlang'ich ma'lumotlar (turlar, hududlar, imtihon nomlari)
  useEffect(() => {
    Promise.all([apiService.getTypes(), apiService.getRegions(), apiService.getExamNames()])
      .then(([typesData, regionsData, examNamesData]) => {
        setTypes(typesData);
        setRegions(regionsData);
        setExamNames(examNamesData);
      })
      .catch((error) => {
        console.error('Error loading API data:', error);
        toast.error(tRef.current('common.error'));
      })
      .finally(() => setLoading(false));
  }, []);

  // Save form data to session storage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      storageService.saveFormData(formData);
    }
  }, [formData]);

  // Save current step to session storage
  useEffect(() => {
    storageService.saveCurrentStep(currentStep);
  }, [currentStep]);

  const loadExams = async (examNameId: number, typeId?: number) => {
    try {
      const params: any = { examname: examNameId };
      if (typeId) {
        params.type = typeId;
      }
      const examsData = await apiService.getExams(params);
      setExams(examsData);
      return examsData;
    } catch (error) {
      console.error('Error loading exams:', error);
      toast.error(t('common.error'));
      return [];
    }
  };

  const loadExamDates = async (examId: number, regionId: number) => {
    try {
      const params = { exam: examId, region: regionId };
      const examDatesData = await apiService.getExamDates(params);
      setExamDates(examDatesData);
      return examDatesData;
    } catch (error) {
      console.error('Error loading exam dates:', error);
      toast.error(t('common.error'));
      return [];
    }
  };

  return {
    // State
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    paymentData,
    setPaymentData,
    loading,
    setLoading,
    resetDialogOpen,
    setResetDialogOpen,

    // API Data
    types,
    regions,
    examNames,
    exams,
    examDates,

    // Functions
    loadExams,
    loadExamDates,
  };
};
