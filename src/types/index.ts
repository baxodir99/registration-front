// API Response Types
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

// Exam Types
export interface Type {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface ExamName {
  id: number;
  name: string;
  offer: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Exam {
  id: number;
  name: string;
  examname: number;
  type: number;
  amount: string;
  created_at: string;
  updated_at: string;
}

export interface ExamDate {
  id: number;
  examname: number;
  exam: number;
  region: string[]; // backend viloyat nomlarini qaytaradi
  date: string;
  regstration_open: string | null;
  regstration_close: string | null;
  capacity: number;
  booked: number;
  availability_status: 'available' | 'half' | 'full';
  availability_percentage: number;
  created_at: string;
  updated_at: string;
}

// User Types
export interface UserProfile {
  id: number;
  ps_ser: string;
  ps_num: string;
  pnfl: number;
  sname: string;
  fname: string;
  mname: string;
  birth_place: string;
  birth_date: string;
  birth_country: string;
  birth_country_id: number;
  livestatus: string;
  nationality: string;
  nationality_id: number;
  sex: string;
  doc_give_place: string;
  doc_give_place_id: number;
  matches_date_begin_document: string;
  matches_date_end_document: string;
  photo: string;
  full_name: string;
  passport: string;
  pnfl_masked?: string;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface PersonalizationCheckForm {
  pnfl: string;
  passport: string;
}

export interface InvoiceRequestForm {
  pnfl?: string; // kirgan foydalanuvchida backend profildan oladi
  examdate: number;
  phone: string;
  email: string;
  region: number;
  terms_accepted: boolean;
  promocode?: string;
}

// PromoCode Types
export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  valid_until: string;
  is_active: boolean;
}

// Payment Types
export interface PaymentResponse {
  invoice: string;
  pay_url: string | null;
  amount: number;
  info_doc?: string | null;
}

// ATMOS Card Payment Types
export interface BindCardRequest {
  card_number: string;   // 16 digits, no spaces
  expiry: string;        // "YYmm" e.g. "2612" for Dec 2026
}

export interface BindCardResponse {
  status: 0 | 1;
  message: string;
  transaction_id: string;
}

export interface BindCardConfirmRequest {
  transaction_id: string;
  otp: string;
  invoice: string;
}

export interface BindCardConfirmResponse {
  status: 0 | 1;
  message: string;
}

export interface ChargeCardRequest {
  invoice: string;
}

export interface ChargeCardResponse {
  status: 0 | 1;
  message: string;
}

// Form Step Types
export interface FormData {
  type?: number;
  region?: number;
  examName?: number;
  exam?: number;
  examDate?: number;
  pnfl?: string;
  passport?: string;
  userProfile?: UserProfile;
  phone?: string;
  email?: string;
  terms_accepted?: boolean;
  promocode?: string;
  promocodeData?: PromoCode;
}

export enum FormStep {
  EXAM_SELECTION = 1,
  PERSONALIZATION = 2,
  CONFIRMATION = 3,
  PAYMENT = 4,
}

// Language Types
export type Language = 'uz' | 'ru' | 'en' | 'kaa';