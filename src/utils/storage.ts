import { STORAGE_KEYS } from '../constants';
import { FormData, FormStep } from '../types';

// Session storage utilities
export const storageService = {
  // Save form data
  saveFormData: (data: Partial<FormData>): void => {
    try {
      const existing = storageService.getFormData();
      const updated = { ...existing, ...data };
      sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  },

  // Get form data
  getFormData: (): Partial<FormData> => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting form data:', error);
      return {};
    }
  },

  // Clear form data
  clearFormData: (): void => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  },

  // Save current step
  saveCurrentStep: (step: FormStep): void => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
    } catch (error) {
      console.error('Error saving current step:', error);
    }
  },

  // Get current step
  getCurrentStep: (): FormStep => {
    try {
      const step = sessionStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      return step ? parseInt(step, 10) as FormStep : FormStep.EXAM_SELECTION;
    } catch (error) {
      console.error('Error getting current step:', error);
      return FormStep.EXAM_SELECTION;
    }
  },

  // Clear current step
  clearCurrentStep: (): void => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    } catch (error) {
      console.error('Error clearing current step:', error);
    }
  },

  // Save language
  saveLanguage: (language: string): void => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },

  // Get language
  getLanguage: (): string => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'uz';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'uz';
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      storageService.clearFormData();
      storageService.clearCurrentStep();
      // Don't clear language as user preference should persist
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },

  // Check if form data exists
  hasFormData: (): boolean => {
    try {
      const data = storageService.getFormData();
      return Object.keys(data).length > 0;
    } catch (error) {
      console.error('Error checking form data:', error);
      return false;
    }
  },

  // Get specific field from form data
  getFormField: <K extends keyof FormData>(field: K): FormData[K] | undefined => {
    try {
      const data = storageService.getFormData();
      return data[field];
    } catch (error) {
      console.error('Error getting form field:', error);
      return undefined;
    }
  },

  // Save specific field to form data
  saveFormField: <K extends keyof FormData>(field: K, value: FormData[K]): void => {
    try {
      const data = storageService.getFormData();
      data[field] = value;
      storageService.saveFormData(data);
    } catch (error) {
      console.error('Error saving form field:', error);
    }
  },
};