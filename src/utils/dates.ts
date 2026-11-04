import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/ru';

/** Qoraqalpoq tili uchun dayjs lokali yo'q: oy nomlari o'zbekcha lotin yozuvida */
export const dayjsLocale = (language: string): string => {
  if (language === 'ru') return 'ru';
  if (language === 'en') return 'en';
  return 'uz-latn';
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Dekabr 2026" */
export const monthLabel = (date: Dayjs, language: string): string =>
  capitalize(date.locale(dayjsLocale(language)).format('MMMM YYYY'));

/** "Dekabr" */
export const monthName = (date: Dayjs, language: string): string =>
  capitalize(date.locale(dayjsLocale(language)).format('MMMM'));

/** "18-noyabr" (uz) yoki "18 ноября" */
export const dayMonth = (date: Dayjs | string, language: string): string => {
  const value = dayjs(date).locale(dayjsLocale(language));
  return dayjsLocale(language) === 'uz-latn'
    ? `${value.date()}-${value.format('MMMM').toLowerCase()}`
    : value.format('D MMMM');
};

/** "18-noyabr, 2026" */
export const longDate = (date: Dayjs | string, language: string): string =>
  `${dayMonth(date, language)}, ${dayjs(date).year()}`;
