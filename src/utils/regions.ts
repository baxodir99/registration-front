type Translate = (key: string, options: { defaultValue: string }) => string;

/** Hudud nomi tanlangan tilda (locales -> regions). Bazadagi nom o'zgarmaydi, tarjimasi yo'q nom o'zicha chiqadi */
export const regionName = (t: Translate, name?: string | null): string | undefined =>
  name ? t(`regions.${name}`, { defaultValue: name }) : undefined;
