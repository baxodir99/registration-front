import api, { setAccessToken } from './api';
import { ExamDate } from '../types';

export interface MeProfile {
  full_name: string;
  first_name: string;
  pnfl_masked: string;
  passport_masked: string;
  photo: string | null;
}

export interface Me {
  phone: string;
  email: string;
  has_password: boolean;
  has_profile: boolean;
  profile: MeProfile | null;
}

export interface LoginResult {
  access: string;
  has_password: boolean;
  has_profile: boolean;
}

export type RegistrationStatus = 'pending' | 'registered' | 'done' | 'expired';

export interface Registration {
  id: number;
  invoice: number;
  exam_name: string;
  exam: string;
  region: string;
  date: string | null;
  amount: string;
  is_paid: boolean;
  status: RegistrationStatus;
  deadline: string | null;
  pay_method: 'atmos' | 'billing';
  info_doc_url: string | null;
  has_result: boolean;
  has_certificate: boolean;
}

export interface CabinetPayment {
  created_at: string;
  invoice: number;
  exam: string;
  amount: string;
  status: 'paid' | 'pending' | 'cancelled';
  pay_method: 'atmos' | 'billing';
}

export interface Certificate {
  id: number;
  examname: string;
  fio: string;
  exam_start: string | null;
  exam_end: string | null;
  given: string | null;
  is_send_pdf: boolean;
  pdf_url: string;
  image_b64: string;
}

interface ResultExam {
  examname: string;
  exam: string;
  date: string;
}

export interface Results {
  more_part_data: {
    examdate: ResultExam;
    score_r: number;
    score_l: number;
    score_w: number;
    score_s: number;
    score_total: number;
    level_cefr: string | null;
  }[];
  math_subject_data: { examdate: ResultExam; score_z: number; score_t: number; percent: number; level: string | null }[];
  to_subject_data: { examdate: ResultExam; score_e: number; score_t: number; score_total: number; percent: number; level: string | null }[];
}

export interface LoginEvent {
  method: string;
  ip: string;
  user_agent: string;
  success: boolean;
  created_at: string;
}

export interface PaymentDetail {
  invoice: string;
  pay_url: string | null;
  amount: number;
  info_doc: string | null;
  pay_method: 'atmos' | 'billing';
  exam: string | null;
  date: string | null;
  deadline: string | null;
  full_name: string;
}

export interface OpenExam extends Pick<ExamDate, 'id' | 'date' | 'availability_status'> {
  examname: string;
  exam: { name: string };
}

const post = async <T>(url: string, data?: unknown): Promise<T> => (await api.post<T>(url, data)).data;
const get = async <T>(url: string): Promise<T> => (await api.get<T>(url)).data;

export const authApi = {
  sendCode: (phone: string, purpose: 'login' | 'set_password' | 'reset_password') =>
    post<{ session_id: string; resend_in: number }>('/account/auth/sms/send/', { phone, purpose }),
  verifyCode: async (session_id: string, code: string) => {
    const result = await post<LoginResult>('/account/auth/sms/verify/', { session_id, code });
    setAccessToken(result.access);
    return result;
  },
  passwordLogin: async (phone: string, password: string) => {
    const result = await post<LoginResult>('/account/auth/password/login/', { phone, password });
    setAccessToken(result.access);
    return result;
  },
  setPassword: (password: string, password2: string) => post('/account/auth/password/set/', { password, password2 }),
  resetPassword: (session_id: string, code: string, password: string, password2: string) =>
    post('/account/auth/password/reset/', { session_id, code, password, password2 }),
  logout: () => post('/account/auth/logout/'),
  logoutAll: () => post('/account/auth/logout-all/'),
  me: () => get<Me>('/account/me/'),
  updateEmail: async (email: string) => (await api.patch<Me>('/account/me/', { email })).data,
  linkProfile: (pnfl: string, passport: string) => post('/account/me/link-profile/', { pnfl, passport }),
  registrations: () => get<Registration[]>('/account/me/registrations/'),
  payments: () => get<CabinetPayment[]>('/account/me/payments/'),
  results: () => get<Results>('/account/me/results/'),
  certificates: () => get<Certificate[]>('/account/me/certificates/'),
  logins: () => get<LoginEvent[]>('/account/me/logins/'),
  paymentDetail: (invoice: string) => get<PaymentDetail>(`/main/payment/${invoice}/`),
  openExams: async () =>
    (await get<{ results: OpenExam[] }>('/main/exams-list/?status=true&page_size=3')).results,
};
