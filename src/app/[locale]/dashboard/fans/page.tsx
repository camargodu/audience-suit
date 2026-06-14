import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import FansTable, { type FanRow } from "./FansTable";

export default async function FansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, tDash] = await Promise.all([
    getTranslations({ locale, namespace: "Fans" }),
    getTranslations({ locale, namespace: "Dashboard" }),
  ]);

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();
  if (!userRow) redirect(`/${locale}/auth/login`);

  const { data: fansRaw } = await supabase
    .from("fans")
    .select("id, email, name, created_at, fan_consents(purpose, granted)")
    .eq("tenant_id", userRow.tenant_id)
    .order("created_at", { ascending: false });

  const fans: FanRow[] = (fansRaw ?? []).map((f: any) => ({
    id: f.id,
    email: f.email,
    name: f.name,
    created_at: f.created_at,
    consents: f.fan_consents ?? [],
  }));

  const totalEmailMarketing = fans.filter((f) =>
    f.consents.some((c) => c.purpose === "email_marketing" && c.granted)
  ).length;

  const totalPush = fans.filter((f) =>
    f.consents.some((c) => c.purpose === "push_notification" && c.granted)
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-400 mb-1">
          ← <a href={`/${locale}/dashboard`} className="hover:underline">{tDash("welcome")}</a>
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("totalFans"), value: fans.length },
          { label: t("emailMarketing"), value: totalEmailMarketing },
          { label: t("pushEnabled"), value: totalPush },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-brand-accent">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <FansTable fans={fans} locale={locale} />
    </div>
  );
}
