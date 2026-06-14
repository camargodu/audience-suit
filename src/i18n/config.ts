export const locales = ["en", "pt-br", "es", "ja-jp"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Onda W0: apenas o locale padrão (en) tem mensagens completas.
 * pt-br, es e ja-jp já existem como rotas válidas (preparadas para a Onda W4),
 * mas ainda usam fallback para o inglês.
 */
export const localesWithContent: Locale[] = ["en"];
