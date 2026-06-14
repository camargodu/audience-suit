import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import type { BillingStatus, AppStatus } from "@/lib/types/runtime-config";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userProfile } = await supabase
    .from("users")
    .select("tenant_id, name, role")
    .eq("id", user.id)
    .single();

  if (!userProfile) redirect(`/${locale}/auth/login?error=setup_incomplete`);

  const [{ data: tenant }, { data: runtimeStatus }, { data: profile }, { data: links }, { count: fanCount }] =
    await Promise.all([
      supabase.from("tenants").select("name, slug, plan").eq("id", userProfile.tenant_id).single(),
      supabase.from("tenant_runtime_status").select("billing_status, app_status").eq("tenant_id", userProfile.tenant_id).single(),
      supabase.from("creator_profiles").select("display_name, description, primary_color").eq("tenant_id", userProfile.tenant_id).maybeSingle(),
      supabase.from("social_links").select("id").eq("tenant_id", userProfile.tenant_id).limit(1),
      supabase.from("fans").select("id", { count: "exact", head: true }).eq("tenant_id", userProfile.tenant_id),
    ]);

  const onboardingIncomplete = !profile?.description || !links?.length;
  const billingStatus = (runtimeStatus?.billing_status ?? "trialing") as BillingStatus;
  const appStatus = (runtimeStatus?.app_status ?? "active") as AppStatus;

  const BILLING_LABELS: Record<string, string> = {
    trialing: t("statusTrialing"),
    active: t("statusActive"),
    past_due: t("statusPastDue"),
    limited: t("statusLimited"),
    suspended: t("statusSuspended"),
    canceled: t("statusCanceled"),
  };

  const BILLING_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-yellow-100 text-yellow-800",
    limited: "bg-orange-100 text-orange-800",
    suspended: "bg-red-100 text-red-800",
    canceled: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("welcome")}, {profile?.display_name ?? userProfile.name ?? user.email}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("snapshot")}</p>
      </div>

      {onboardingIncomplete && (
        <div className="flex items-start gap-4 rounded-xl border border-teal-200 bg-teal-50 px-5 py-4">
          <span className="mt-0.5 text-xl text-brand-accent">✦</span>
          <div className="flex-1">
            <p className="font-medium text-teal-900">{t("completeSetupTitle")}</p>
            <p className="mt-0.5 text-sm text-teal-700">{t("completeSetupDesc")}</p>
          </div>
          <Link
            href={`/${locale}/onboarding`}
            className="shrink-0 rounded-md bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            {t("completeSetupBtn")}
          </Link>
        </div>
      )}

      {/* Hub info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t("hubSection")}
        </h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">{t("hubName")}</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{tenant?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("publicUrl")}</dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-700">
              {tenant?.slug ? `…/app/${tenant.slug}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("plan")}</dt>
            <dd className="mt-0.5 capitalize font-medium text-slate-900">{tenant?.plan ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("accountStatus")}</dt>
            <dd className="mt-0.5">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${BILLING_COLORS[billingStatus] ?? "bg-slate-100 text-slate-600"}`}>
                {BILLING_LABELS[billingStatus] ?? billingStatus}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("fanAppStatus")}</dt>
            <dd className="mt-0.5">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${appStatus === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {appStatus === "active" ? t("appOnline") : t("appOffline")}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Quick actions */}
      {tenant?.slug && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t("manageSection")}
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href={`/${locale}/dashboard/profile`} className="font-medium text-brand-accent hover:opacity-80">
                {t("editProfile")} →
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dashboard/links`} className="font-medium text-brand-accent hover:opacity-80">
                {t("manageLinks")} →
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dashboard/events`} className="font-medium text-brand-accent hover:opacity-80">
                {t("manageEvents")} →
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dashboard/push`} className="font-medium text-brand-accent hover:opacity-80">
                {t("sendPush")} →
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dashboard/fans`} className="font-medium text-brand-accent hover:opacity-80">
                {t("manageFans")} {fanCount != null ? `(${fanCount})` : ""} →
              </Link>
            </li>
            <li className="border-t border-slate-100 pt-2">
              <Link href={`/${locale}/app/${tenant.slug}`} className="text-slate-500 hover:text-brand-accent">
                {t("previewApp")} ↗
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
