import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  RuntimeConfigResponse,
  RuntimeConfigFeatures,
  RuntimeConfigEvent,
} from "@/lib/types/runtime-config";

/**
 * GET /api/v1/tenants/{slug}/runtime-config
 *
 * Endpoint público obrigatório que o app/PWA consulta para decidir o que
 * exibir, conforme docs/creator-hub-master.md, seção 11.8.
 *
 * Cache recomendado (seção 11.9): 1 a 5 minutos para esta rota.
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createServiceRoleClient();

  // 1. Localiza o tenant pelo slug
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, slug, plan")
    .eq("slug", params.slug)
    .maybeSingle();

  if (tenantError) {
    // Mesmo em erro de infraestrutura, nunca expor stack trace ao app.
    return NextResponse.json(
      {
        tenantId: params.slug,
        appStatus: "suspended",
        billingStatus: "suspended",
        publicMessage: "Este app está temporariamente indisponível.",
        showOfficialLinks: true,
        socialLinks: [],
      } satisfies RuntimeConfigResponse,
      { status: 200 }
    );
  }

  if (!tenant) {
    return NextResponse.json({ error: "tenant_not_found" }, { status: 404 });
  }

  // 2. Busca o status de runtime (billing_status / app_status)
  const { data: runtimeStatus } = await supabase
    .from("tenant_runtime_status")
    .select(
      "billing_status, app_status, public_message, show_official_links"
    )
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  const billingStatus = runtimeStatus?.billing_status ?? "trialing";
  const appStatus = runtimeStatus?.app_status ?? "active";

  // 3. Busca dados públicos do perfil do criador (tema)
  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("display_name, logo_url, primary_color, secondary_color")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  // 4. Busca links sociais ativos e eventos publicados (em paralelo)
  const [{ data: socialLinksData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("social_links")
      .select("platform, url")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("events")
      .select("id, title, description, starts_at, ends_at, location, url")
      .eq("tenant_id", tenant.id)
      .eq("is_published", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(10),
  ]);

  const socialLinks = socialLinksData ?? [];
  const events: RuntimeConfigEvent[] = eventsData ?? [];

  // 5. Monta a resposta de acordo com o app_status
  if (appStatus === "suspended" || appStatus === "archived") {
    const response: RuntimeConfigResponse = {
      tenantId: tenant.id,
      appStatus: "suspended",
      billingStatus,
      publicMessage:
        runtimeStatus?.public_message ??
        "Este app está temporariamente indisponível.",
      showOfficialLinks: runtimeStatus?.show_official_links ?? true,
      socialLinks,
    };

    return NextResponse.json(response);
  }

  // 6. Feature flags por plano (versão simplificada da Onda W0;
  //    a partir da W2, isso vem de tenant_entitlements)
  const features: RuntimeConfigFeatures = {
    events: true,
    push: appStatus !== "limited",
    favorites: true,
    sponsors: appStatus !== "limited",
    store: true,
    community: true,
  };

  const response: RuntimeConfigResponse = {
    tenantId: tenant.id,
    appStatus: appStatus === "limited" ? "limited" : "active",
    billingStatus,
    theme: {
      primaryColor: profile?.primary_color ?? "#111827",
      secondaryColor: profile?.secondary_color ?? "#ffffff",
      logoUrl: profile?.logo_url ?? null,
    },
    features,
    socialLinks,
    events,
    sponsors: [],
    storeLinks: [],
  };

  return NextResponse.json(response);
}
