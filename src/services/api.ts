import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import {
  ApiResponse,
  Type,
  Region,
  ExamName,
  Exam,
  ExamDate,
  UserProfile,
  PersonalizationCheckForm,
  InvoiceRequestForm,
  PaymentResponse,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Request logging removed for production
    return config;
  },
  (error) => {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Response logging removed for production
    return response;
  },
  (error) => {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Response Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// API Methods
export const apiService = {
  // Get types
  getTypes: async (): Promise<Type[]> => {
    const response = await api.get<Type[]>(API_ENDPOINTS.TYPES);
    return response.data;
  },

  // Get regions
  getRegions: async (): Promise<Region[]> => {
    const response = await api.get<Region[]>(API_ENDPOINTS.REGIONS);
    return response.data;
  },

  // Get exam names
  getExamNames: async (): Promise<ExamName[]> => {
    const response = await api.get<ExamName[]>(API_ENDPOINTS.EXAM_NAMES);
    return response.data;
  },

  // Get exams with filters
  getExams: async (params?: {
    examname?: number;
    type?: number;
    search?: string;
  }): Promise<Exam[]> => {
    const response = await api.get<Exam[]>(API_ENDPOINTS.EXAMS, { params });
    return response.data;
  },

  // Get exam dates with filters
  getExamDates: async (params?: {
    examname?: number;
    exam?: number;
    region?: number;
  }): Promise<ExamDate[]> => {
    const response = await api.get<ExamDate[]>(API_ENDPOINTS.EXAM_DATES, { params });
    return response.data;
  },

  // Check personalization
  checkPersonalization: async (
    data: PersonalizationCheckForm
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await api.post<ApiResponse<UserProfile>>(
      API_ENDPOINTS.CHECK_PERSONALIZATION,
      data
    );
    return response.data;
  },

  // Create invoice
  createInvoice: async (data: InvoiceRequestForm): Promise<ApiResponse<PaymentResponse>> => {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      API_ENDPOINTS.CREATE_INVOICE,
      data
    );
    return response.data;
  },
};

export default api;