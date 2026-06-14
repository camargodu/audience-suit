import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import type { RuntimeConfigResponse } from "@/lib/types/runtime-config";
import FanRegistrationForm from "./FanRegistrationForm";
import OneSignalInit from "@/components/OneSignalInit";
import PushSubscribeButton from "@/components/PushSubscribeButton";

export const revalidate = 60;

async function fetchRuntimeConfig(slug: string): Promise<RuntimeConfigResponse | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/v1/tenants/${slug}/runtime-config`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      return { tenantId: slug, appStatus: "suspended", billingStatus: "suspended", showOfficialLinks: false, socialLinks: [] };
    }
    return (await res.json()) as RuntimeConfigResponse;
  } catch {
    return { tenantId: slug, appStatus: "suspended", billingStatus: "suspended", showOfficialLinks: false, socialLinks: [] };
  }
}

const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", discord: "Discord",
  whatsapp: "WhatsApp", telegram: "Telegram", website: "Website", store: "Store", other: "Link",
};

export default async function PwaPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Fan" });
  const config = await fetchRuntimeConfig(slug);

  if (!config) notFound();

  if (config.appStatus === "suspended" || config.appStatus === "archived") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-lg font-medium text-slate-700">
          {config.publicMessage ?? t("suspended")}
        </p>
        {config.showOfficialLinks && config.socialLinks.length > 0 && (
          <nav className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">{t("officialChannels")}</p>
            {config.socialLinks.map((link) => (
              <a key={link.platform} href={link.url} target="_blank" rel="noreferrer noopener"
                className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {PLATFORM_LABELS[link.platform] ?? link.platform}
              </a>
            ))}
          </nav>
        )}
      </main>
    );
  }

  const activeConfig = config as Extract<RuntimeConfigResponse, { appStatus: "active" | "limited" }>;
  const primaryColor = activeConfig.theme?.primaryColor ?? "#111827";

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-6 py-12 text-center"
      style={{ backgroundColor: primaryColor + "10" }}>

      {activeConfig.theme?.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={activeConfig.theme.logoUrl} alt="Creator logo" className="h-20 w-20 rounded-full object-cover shadow" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white shadow"
          style={{ backgroundColor: primaryColor }}>
          {slug[0]?.toUpperCase() ?? "C"}
        </div>
      )}

      <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>{slug}</h1>

      {activeConfig.appStatus === "limited" && (
        <p className="rounded-md bg-yellow-50 px-4 py-2 text-xs text-yellow-700">{t("limitedFeatures")}</p>
      )}

      {activeConfig.socialLinks.length > 0 ? (
        <nav className="flex w-full max-w-xs flex-col gap-3">
          {activeConfig.socialLinks.map((link) => (
            <a key={link.platform} href={link.url} target="_blank" rel="noreferrer noopener"
              className="rounded-lg px-5 py-3 text-sm font-semibold text-white shadow"
              style={{ backgroundColor: primaryColor }}>
              {PLATFORM_LABELS[link.platform] ?? link.platform}
            </a>
          ))}
        </nav>
      ) : (
        <p className="text-sm text-slate-400">{t("noLinks")}</p>
      )}

      {activeConfig.features.events && activeConfig.events.length > 0 && (
        <div className="w-full max-w-xs space-y-2 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {t("upcomingEvents")}
          </h2>
          {activeConfig.events.map((ev) => (
            <a key={ev.id} href={ev.url ?? undefined} target={ev.url ? "_blank" : undefined}
              rel="noreferrer noopener"
              className={`block rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm ${ev.url ? "hover:border-slate-300" : "cursor-default"}`}>
              <p className="text-sm font-semibold text-slate-900">{ev.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {new Date(ev.starts_at).toLocaleString(locale, {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
                {ev.location ? ` · ${ev.location}` : ""}
              </p>
              {ev.description && (
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{ev.description}</p>
              )}
            </a>
          ))}
        </div>
      )}

      <div className="w-full max-w-xs space-y-3 border-t border-slate-200 pt-4">
        <PushSubscribeButton
          primaryColor={primaryColor}
          labels={{
            enable: t("enablePush"),
            disable: t("disablePush"),
            blocked: t("pushBlocked"),
            loading: t("pushLoading"),
          }}
        />
        <FanRegistrationForm slug={slug} primaryColor={primaryColor} />
      </div>

      <OneSignalInit tenantSlug={slug} />
    </main>
  );
}
