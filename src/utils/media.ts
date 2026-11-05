import { API_BASE_URL } from '../constants';

/** Backend proksi ortida fayl havolasini http bilan beradi, u esa ochilmaydi: manzil doim API dan olinadi */
export const mediaUrl = (url: string): string => {
  const index = url.indexOf('/media/');
  return index === -1 ? url : `${API_BASE_URL}${url.slice(index)}`;
};
