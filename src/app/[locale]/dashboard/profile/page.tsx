import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Profile" });
  const tDash = await getTranslations({ locale, namespace: "Dashboard" });

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!userRow) redirect(`/${locale}/auth/login?error=setup_incomplete`);

  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("display_name, description, logo_url, banner_url, primary_color, secondary_color")
    .eq("tenant_id", userRow.tenant_id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/dashboard`} className="text-sm text-slate-400 hover:text-slate-600">
          ← {tDash("welcome")}
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-bold text-slate-900">{t("title")}</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-sm text-slate-500">{t("subtitle")}</p>
        <ProfileForm
          locale={locale}
          profile={{
            displayName: profile?.display_name ?? "",
            description: profile?.description ?? null,
            logoUrl: profile?.logo_url ?? null,
            bannerUrl: profile?.banner_url ?? null,
            primaryColor: profile?.primary_color ?? "#1e293b",
            secondaryColor: profile?.secondary_color ?? "#ffffff",
          }}
        />
      </div>
    </div>
  );
}
