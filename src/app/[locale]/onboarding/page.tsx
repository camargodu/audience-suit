import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Onboarding" });

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("tenant_id, name")
    .eq("id", user.id)
    .single();

  if (!userProfile) {
    redirect(`/${locale}/auth/login?error=setup_incomplete`);
  }

  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("display_name, description")
    .eq("tenant_id", userProfile.tenant_id)
    .maybeSingle();

  const initialDisplayName = profile?.display_name ?? userProfile.name ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <img
            src="/brand/logo-light.svg"
            alt="Audience Suite"
            className="mx-auto h-8 w-auto"
          />
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <OnboardingWizard
            locale={locale}
            initialDisplayName={initialDisplayName}
          />
        </div>
      </div>
    </main>
  );
}
