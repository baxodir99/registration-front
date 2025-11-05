import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { storageService } from '../utils/storage';
import { apiService } from '../services/api';
import { FormData, FormStep, Type, Region, ExamName, Exam, ExamDate, PaymentResponse } from '../types';

export const useAppState = () => {
  const { t } = useTranslation();

  // State
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.EXAM_SELECTION);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // API Data
  const [types, setTypes] = useState<Type[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [examNames, setExamNames] = useState<ExamName[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);

  // Initialize app
  useEffect(() => {
    initializeApp();
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

  const initializeApp = async () => {
    try {
      setLoading(true);

      // Load saved data from session storage
      const savedFormData = storageService.getFormData();
      const savedStep = storageService.getCurrentStep();

      if (Object.keys(savedFormData).length > 0) {
        setFormData(savedFormData);
        setCurrentStep(savedStep);
      }

      // Load initial API data
      await loadApiData();
    } catch (error) {
      console.error('App initialization error:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadApiData = async () => {
    try {
      const [typesData, regionsData, examNamesData] = await Promise.all([
        apiService.getTypes(),
        apiService.getRegions(),
        apiService.getExamNames(),
      ]);

      setTypes(typesData);
      setRegions(regionsData);
      setExamNames(examNamesData);
    } catch (error) {
      console.error('Error loading API data:', error);
      toast.error(t('common.error'));
    }
  };

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
