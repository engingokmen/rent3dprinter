import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Default to "en" if locale is invalid or missing (safe for root layout)
  const validLocale = locale && locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : "en";

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});

