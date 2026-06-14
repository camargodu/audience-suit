"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_META: Record<Locale, { flag: string; label: string }> = {
  en: { flag: "🇺🇸", label: "English" },
  "pt-br": { flag: "🇧🇷", label: "Português" },
  es: { flag: "🇪🇸", label: "Español" },
  "ja-jp": { flag: "🇯🇵", label: "日本語" },
};

export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as Locale;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    window.location.href = segments.join("/");
  }

  return (
    <select
      defaultValue={currentLocale}
      onChange={handleChange}
      aria-label="Language"
      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {LOCALE_META[l].flag}{"  "}{LOCALE_META[l].label}
        </option>
      ))}
    </select>
  );
}
