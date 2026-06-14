import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { createServerClient } from "@/lib/supabase/ssr";
import EventsManager from "./EventsManager";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!userRow) redirect(`/${locale}/auth/login`);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, starts_at, ends_at, location, url, is_published")
    .eq("tenant_id", userRow.tenant_id)
    .order("starts_at", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <EventsManager events={events ?? []} />
    </div>
  );
}
