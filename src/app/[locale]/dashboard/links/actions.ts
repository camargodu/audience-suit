"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/ssr";

export type LinkState = { error?: string; success?: string } | null;

export async function addLink(
  _prev: LinkState,
  formData: FormData
): Promise<LinkState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const platform = formData.get("platform") as string;
  const url = (formData.get("url") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const locale = formData.get("locale") as string;

  if (!platform || !url) return { error: "Platform and URL are required." };
  try { new URL(url); } catch { return { error: "Invalid URL." }; }

  const { data: userRow } = await supabase
    .from("users").select("tenant_id").eq("id", user.id).single();
  if (!userRow) return { error: "User not found." };

  const { data: existing } = await supabase
    .from("social_links")
    .select("sort_order")
    .eq("tenant_id", userRow.tenant_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("social_links").insert({
    tenant_id: userRow.tenant_id,
    platform,
    url,
    label: label || null,
    is_active: true,
    sort_order: nextOrder,
  });

  if (error) return { error: "Failed to add link." };

  revalidatePath(`/${locale}/dashboard/links`);
  return { success: "Link added." };
}

export async function toggleLink(id: string, isActive: boolean, locale: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from("social_links").update({ is_active: isActive }).eq("id", id);
  revalidatePath(`/${locale}/dashboard/links`);
}

export async function deleteLink(id: string, locale: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from("social_links").delete().eq("id", id);
  revalidatePath(`/${locale}/dashboard/links`);
}

export async function reorderLinks(
  ids: string[],
  locale: string
): Promise<void> {
  const supabase = createServerClient();
  await Promise.all(
    ids.map((id, index) =>
      supabase.from("social_links").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
  revalidatePath(`/${locale}/dashboard/links`);
}
