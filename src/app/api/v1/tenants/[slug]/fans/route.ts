import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendFanWelcomeEmail } from "@/lib/resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServiceRoleClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!tenant) {
    return NextResponse.json({ error: "tenant_not_found" }, { status: 404 });
  }

  let body: { email?: string; name?: string; consents?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || null;
  const consents: string[] = body.consents ?? [];

  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const validPurposes = ["terms", "email_marketing", "push_notification", "sponsor_offers"];
  if (!consents.includes("terms")) {
    return NextResponse.json({ error: "terms_required" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const { data: fan, error: fanError } = await supabase
    .from("fans")
    .upsert(
      { tenant_id: tenant.id, email, name },
      { onConflict: "tenant_id,email", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (fanError || !fan) {
    return NextResponse.json({ error: "registration_failed" }, { status: 500 });
  }

  const consentRows = validPurposes.map((purpose) => ({
    fan_id: fan.id,
    tenant_id: tenant.id,
    purpose,
    granted: consents.includes(purpose),
    ip_address: ip,
    user_agent: userAgent,
    granted_at: consents.includes(purpose) ? new Date().toISOString() : null,
  }));

  await supabase
    .from("fan_consents")
    .upsert(consentRows, { onConflict: "fan_id,purpose" });

  // Send welcome email (fire-and-forget — does not block response)
  if (process.env.RESEND_API_KEY) {
    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("display_name, primary_color")
      .eq("tenant_id", tenant.id)
      .maybeSingle();

    sendFanWelcomeEmail({
      fanEmail: email,
      fanName: name,
      creatorName: profile?.display_name ?? "Creator",
      primaryColor: profile?.primary_color ?? "#0d9488",
      hubUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/app/${slug}`,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
