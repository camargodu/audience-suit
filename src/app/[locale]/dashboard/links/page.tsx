import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import LinksManager from "./LinksManager";

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Links" });
  const tDash = await getTranslations({ locale, namespace: "Dashboard" });

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userRow } = await supabase
    .from("users").select("tenant_id").eq("id", user.id).single();
  if (!userRow) redirect(`/${locale}/auth/login?error=setup_incomplete`);

  const { data: links } = await supabase
    .from("social_links")
    .select("id, platform, label, url, is_active, sort_order")
    .eq("tenant_id", userRow.tenant_id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/dashboard`} className="text-sm text-slate-400 hover:text-slate-600">
          ← {tDash("welcome")}
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-bold text-slate-900">{t("title")}</h1>
      </div>

      <p className="text-sm text-slate-500">{t("subtitle")}</p>

      <LinksManager locale={locale} links={links ?? []} />
    </div>
  );
}
