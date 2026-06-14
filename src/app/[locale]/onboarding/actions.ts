"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | null;

export async function saveProfileStep(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const displayName = (formData.get("displayName") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!displayName) return { error: "Display name is required." };

  const { error } = await supabase
    .from("creator_profiles")
    .update({ display_name: displayName, description: description || null })
    .eq("tenant_id", (await getTenantId(supabase, user.id)));

  return error ? { error: "Failed to save profile." } : null;
}

export async function saveBrandingStep(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const primaryColor = (formData.get("primaryColor") as string)?.trim();
  const hexPattern = /^#[0-9a-fA-F]{6}$/;
  if (primaryColor && !hexPattern.test(primaryColor)) {
    return { error: "Invalid color format. Use #rrggbb." };
  }

  const { error } = await supabase
    .from("creator_profiles")
    .update({ primary_color: primaryColor || "#1e293b" })
    .eq("tenant_id", (await getTenantId(supabase, user.id)));

  return error ? { error: "Failed to save branding." } : null;
}

export async function saveSocialLinkStep(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const platform = formData.get("platform") as string;
  const url = (formData.get("url") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();

  if (!platform || !url) return { error: "Platform and URL are required." };

  try { new URL(url); } catch { return { error: "Invalid URL." }; }

  const tenantId = await getTenantId(supabase, user.id);

  const { error } = await supabase.from("social_links").insert({
    tenant_id: tenantId,
    platform,
    url,
    label: label || null,
    is_active: true,
    sort_order: 1,
  });

  return error ? { error: "Failed to save link." } : null;
}

export async function finishOnboarding(locale: string): Promise<void> {
  redirect(`/${locale}/dashboard`);
}

async function getTenantId(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userId: string
): Promise<string> {
  const { data } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", userId)
    .single();
  if (!data?.tenant_id) throw new Error("tenant not found");
  return data.tenant_id;
}
