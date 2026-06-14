import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { createServerClient } from "@/lib/supabase/ssr";
import PushForm from "./PushForm";

export default async function PushPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Push" });

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!userRow) redirect(`/${locale}/auth/login`);

  const { data: tenant } = await supabase
    .from("tenants")
    .select("slug")
    .eq("id", userRow.tenant_id)
    .single();

  const { count } = await supabase
    .from("fan_consents")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userRow.tenant_id)
    .eq("purpose", "push_notification")
    .eq("granted", true);

  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm text-slate-600">
          <span className="text-2xl font-bold text-brand-accent">{count ?? 0}</span>{" "}
          {t("subscribers")}
          {tenant?.slug ? ` · ${t("hubLabel")}: ${tenant.slug}` : ""}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PushForm />
      </div>

      <p className="text-xs text-slate-400">{t("disclaimer")}</p>
    </div>
  );
}
