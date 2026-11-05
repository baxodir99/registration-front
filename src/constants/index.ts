// API Endpoints
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.registration.ilmiymarkaz.uz";

export const API_ENDPOINTS = {
  TYPES: "/main/types/",
  REGIONS: "/main/regions/",
  EXAM_NAMES: "/main/exam-names/",
  EXAMS: "/main/exams/",
  EXAM_DATES: "/main/exam-dates/",
  CHECK_PERSONALIZATION: "/account/check-personalization/",
  CREATE_INVOICE: "/main/invoice-create/",
  PROMOCODES: "/main/promocodes/",
  BIND_CARD: "/main/bind-card/",
  BIND_CARD_CONFIRM: "/main/bind-card/confirm/",
  PAY_CREATE: "/main/pay/create/",
} as const;


// Yordam xizmati (matni locales da: header.help)
export const SUPPORT_PHONE_TEL = "+998955156868";

// Promokod maydoni hozircha yashirilgan. Qayta yoqish uchun true qiling (backend tayyor)
export const PROMOCODE_ENABLED = false;

// Validation Rules
export const VALIDATION = {
  PNFL_LENGTH: 14,
  PASSPORT_PATTERN: /^[A-Z]{2}\d{7}$/,
  PHONE_PATTERN: /^\+998\d{9}$/,
  CARD_LENGTH: 16,
  OTP_LENGTH: 6,
  EXPIRY_PATTERN: /^(0[1-9]|1[0-2])\/\d{2}$/,
} as const;

// Session Storage Keys
export const STORAGE_KEYS = {
  FORM_DATA: "exam_registration_form_data",
  CURRENT_STEP: "exam_registration_step",
  // 5 bosqichli eski versiya shu kalitga yozgan (qarang: storage.getCurrentStep)
  LEGACY_CURRENT_STEP: "exam_registration_current_step",
  LANGUAGE: "exam_registration_language",
} as const;

// Languages
export const LANGUAGES = [
  { code: "uz", short: "UZ", name: "Oʻzbekcha" },
  { code: "ru", short: "RU", name: "Русский" },
  { code: "en", short: "EN", name: "English" },
  { code: "kaa", short: "QQ", name: "Qaraqalpaqsha" },
] as const;

export const DEFAULT_LANGUAGE = "uz";

// Form Steps
export const FORM_STEPS = [
  "exam_selection",
  "personalization",
  "confirmation",
  "payment",
] as const;
