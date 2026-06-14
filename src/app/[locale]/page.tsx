import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}`;
  languages["x-default"] = `${SITE_URL}/`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Audience Suite",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

const FEATURE_ICONS = [
  <svg key="links" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>,
  <svg key="crm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>,
  <svg key="pwa" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3M6.75 18h10.5" />
  </svg>,
  <svg key="events" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>,
  <svg key="push" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>,
  <svg key="store" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
  </svg>,
];

const FEATURE_KEYS = [
  ["feature1Title", "feature1Desc"],
  ["feature2Title", "feature2Desc"],
  ["feature3Title", "feature3Desc"],
  ["feature4Title", "feature4Desc"],
  ["feature5Title", "feature5Desc"],
  ["feature6Title", "feature6Desc"],
] as const;

const STEP_KEYS = [
  { num: "01", title: "step1Title", desc: "step1Desc" },
  { num: "02", title: "step2Title", desc: "step2Desc" },
  { num: "03", title: "step3Title", desc: "step3Desc" },
] as const;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Audience Suite",
            applicationCategory: "BusinessApplication",
            description: t("metaDescription"),
            url: SITE_URL,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <div className="min-h-screen bg-white text-slate-900">

        {/* ── Header ── */}
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <img src="/brand/logo-light.svg" alt="Audience Suite" className="h-8 w-auto" />
            <nav className="flex items-center gap-3">
              <LocaleSwitcher currentLocale={locale as Locale} />
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {t("signIn")}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t("getStarted")}
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-brand px-6 py-24 text-white sm:py-32">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-accent opacity-10" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-brand-accent opacity-10" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accentLight">
              {t("badge")}
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              {t("heroTitle")}{" "}
              <span className="text-brand-accentLight">{t("heroTitleAccent")}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 sm:text-xl">
              {t("heroSubtitle")}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={`/${locale}/auth/signup`}
                className="w-full rounded-xl bg-brand-accent px-8 py-3.5 text-base font-bold text-white shadow-lg hover:opacity-90 sm:w-auto"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href={`/${locale}/app/exemplo`}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur hover:bg-white/20 sm:w-auto"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">{t("ctaNote")}</p>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {t("featuresTitle")}{" "}
                <span className="text-brand-accent">{t("featuresTitleAccent")}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-500">{t("featuresSubtitle")}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURE_KEYS.map(([titleKey, descKey], i) => (
                <div
                  key={titleKey}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:border-brand-accent/30 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-brand-accent">
                    {FEATURE_ICONS[i]}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{t(titleKey)}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("howTitle")}</h2>
              <p className="mt-4 text-slate-500">{t("howSubtitle")}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {STEP_KEYS.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-brand-accentLight">
                    {s.num}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{t(s.title)}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{t(s.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-brand px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("ctaFinalTitle")}</h2>
          <p className="mx-auto mt-4 max-w-md text-slate-300">{t("ctaFinalSubtitle")}</p>
          <Link
            href={`/${locale}/auth/signup`}
            className="mt-8 inline-block rounded-xl bg-brand-accent px-10 py-4 text-base font-bold text-white shadow-lg hover:opacity-90"
          >
            {t("ctaFinalBtn")}
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-100 bg-white px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <img src="/brand/logo-dark.svg" alt="Audience Suite" className="h-6 w-auto opacity-70" />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Audience Suite. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
