"use server";

import { createServerClient } from "@/lib/supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignupState =
  | { error: string }
  | { success: true; message: string }
  | null;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns a slug that doesn't already exist in the tenants table. */
async function uniqueSlug(
  base: string,
  service: ReturnType<typeof createServiceRoleClient>
): Promise<string> {
  let candidate = base || "creator";
  let suffix = 2;

  while (true) {
    const { data } = await service
      .from("tenants")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function signUp(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string)?.trim();
  const locale = (formData.get("locale") as string) || "en";

  // ── Basic validation ──────────────────────────────────────────────────────
  if (!email || !password || !displayName) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  // ── 1. Create auth user ───────────────────────────────────────────────────
  const supabase = createServerClient();

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After the user confirms their email, Supabase redirects here.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!data.user) {
    return { error: "Failed to create account. Please try again." };
  }

  // ── 2. Create tenant + profile using service role (bypasses RLS) ──────────
  // auth.users row is created immediately by signUp(), even before the user
  // confirms their email, so FK references to auth.users(id) are valid here.

  const service = createServiceRoleClient();
  const slug = await uniqueSlug(slugify(displayName), service);

  const { data: tenant, error: tenantError } = await service
    .from("tenants")
    .insert({ name: displayName, slug, plan: "starter", status: "active" })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    await service.auth.admin.deleteUser(data.user.id);
    return { error: "Failed to set up your creator account. Please try again." };
  }

  // user row links auth.users → tenants
  const { error: userError } = await service.from("users").insert({
    id: data.user.id,
    tenant_id: tenant.id,
    email,
    name: displayName,
    role: "owner",
  });

  if (userError) {
    await service.from("tenants").delete().eq("id", tenant.id);
    await service.auth.admin.deleteUser(data.user.id);
    return { error: "Failed to set up your creator account. Please try again." };
  }

  const { error: profileError } = await service
    .from("creator_profiles")
    .insert({ tenant_id: tenant.id, display_name: displayName });

  if (profileError) {
    await service.from("users").delete().eq("id", data.user.id);
    await service.from("tenants").delete().eq("id", tenant.id);
    await service.auth.admin.deleteUser(data.user.id);
    return { error: "Failed to set up your creator account. Please try again." };
  }

  const { error: statusError } = await service.from("tenant_runtime_status").insert({
    tenant_id: tenant.id,
    billing_status: "trialing",
    app_status: "active",
    show_official_links: true,
  });

  if (statusError) {
    await service.from("creator_profiles").delete().eq("tenant_id", tenant.id);
    await service.from("users").delete().eq("id", data.user.id);
    await service.from("tenants").delete().eq("id", tenant.id);
    await service.auth.admin.deleteUser(data.user.id);
    return { error: "Failed to set up your creator account. Please try again." };
  }

  // ── 3. Navigate ───────────────────────────────────────────────────────────
  // If email confirmation is disabled in the Supabase project settings,
  // data.session will be set and the user is already authenticated.
  if (data.session) {
    redirect(`/${locale}/onboarding`);
  }

  // Email confirmation required — show a message instead of redirecting.
  return {
    success: true,
    message:
      "Account created! Check your email and click the confirmation link to sign in.",
  };
}
