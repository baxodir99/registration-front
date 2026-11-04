import { PromoCode } from '../types';

/** Promokod qo'llangan narx (ko'rsatish uchun; haqiqiy summani backend hisoblaydi). */
export const discountedAmount = (amount: number, promo?: PromoCode | null): number => {
  if (!promo || !promo.is_active) {
    return amount;
  }
  if (promo.discount_type === 'percent') {
    return amount - (promo.discount_value / 100) * amount;
  }
  if (promo.discount_type === 'amount') {
    return Math.max(0, amount - promo.discount_value);
  }
  return amount;
};
