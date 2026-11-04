import * as yup from 'yup';
import { VALIDATION } from '../constants';

// Validation schemas
export const examSelectionSchema = yup.object({
  examName: yup
    .mixed()
    .required('common.required')
    .test('not-empty', 'common.required', value => value !== '' && value !== 0 && value !== undefined),
  region: yup
    .mixed()
    .required('common.required')
    .test('not-empty', 'common.required', value => value !== '' && value !== 0 && value !== undefined),
  exam: yup
    .mixed()
    .required('common.required')
    .test('not-empty', 'common.required', value => value !== '' && value !== 0 && value !== undefined),
  examDate: yup
    .mixed()
    .required('common.required')
    .test('not-empty', 'common.required', value => value !== '' && value !== 0 && value !== undefined),
});

export const personalizationSchema = yup.object({
  pnfl: yup
    .string()
    .required('common.required')
    .matches(/^\d{14}$/, 'personalization.pnfl_invalid')
    .length(VALIDATION.PNFL_LENGTH, 'personalization.pnfl_invalid'),
  passport: yup
    .string()
    .required('common.required')
    .matches(VALIDATION.PASSPORT_PATTERN, 'personalization.passport_invalid')
    .length(9, 'personalization.passport_invalid'),
});

export const contactSchema = yup.object({
  phone: yup
    .string()
    .required('common.required')
    .matches(VALIDATION.PHONE_PATTERN, 'registration_details.phone_invalid'),
  email: yup
    .string()
    .required('common.required')
    .email('registration_details.email_invalid'),
});

// Utility functions
export const validatePNFL = (pnfl: string): boolean => {
  return /^\d{14}$/.test(pnfl);
};

export const validatePassport = (passport: string): boolean => {
  return VALIDATION.PASSPORT_PATTERN.test(passport);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE_PATTERN.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


// Format functions
export const formatPhone = (phone: string): string => {
  // Check if phone is valid string
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If starts with +998, return as is
  if (cleaned.startsWith('+998')) {
    return cleaned;
  }
  
  // If starts with 998, add +
  if (cleaned.startsWith('998')) {
    return '+' + cleaned;
  }
  
  // If starts with 9, add +998
  if (cleaned.startsWith('9') && cleaned.length === 9) {
    return '+998' + cleaned;
  }
  
  return cleaned;
};

export const formatPassport = (passport: string): string => {
  // Check if passport is valid string
  if (!passport || typeof passport !== 'string') {
    return '';
  }
  
  // Remove spaces and convert to uppercase
  const cleaned = passport.replace(/\s/g, '').toUpperCase();
  
  // Insert space after 2 letters
  if (cleaned.length > 2) {
    return cleaned.slice(0, 2) + cleaned.slice(2);
  }
  
  return cleaned;
};

export const formatPNFL = (pnfl: string): string => {
  // Check if pnfl is valid string
  if (!pnfl || typeof pnfl !== 'string') {
    return '';
  }

  // Remove all non-numeric characters
  return pnfl.replace(/\D/g, '');
};

/**
 * Format date to DD.MM.YYYY format (Uzbekistan standard)
 * @param date - Date object, string, or number
 * @returns Formatted date string in DD.MM.YYYY format
 */
export const formatDate = (date: Date | string | number): string => {
  if (!date) return '';

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}.${month}.${year}`;
};

/**
 * Format date range to DD.MM.YYYY - DD.MM.YYYY format
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date | string | number, endDate: Date | string | number): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start || !end) return '';

  return `${start} - ${end}`;
};