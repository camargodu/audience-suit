import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/ssr";
import type { Locale } from "@/i18n/config";
import { signOut } from "./actions";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [t, supabaseResult] = await Promise.all([
    getTranslations({ locale, namespace: "Dashboard" }),
    Promise.resolve(createServerClient()),
  ]);
  const supabase = supabaseResult;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const signOutAction = signOut.bind(null, locale);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href={`/${locale}/dashboard`}>
            <img
              src="/brand/logo-light.svg"
              alt="Audience Suite"
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {t("signOut")}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
