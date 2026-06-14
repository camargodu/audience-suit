import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Onda W0: carrega sempre o conteúdo em inglês como fallback.
  // A partir da Onda W4, cada locale terá seu próprio arquivo completo
  // (ver docs/creator-hub-master.md, seção 12).
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
