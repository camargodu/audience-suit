"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/ssr";

async function getTenantId() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();
  return data?.tenant_id ?? null;
}

export type EventState = { error: string } | { success: true } | null;

export async function createEvent(_prev: EventState, formData: FormData): Promise<EventState> {
  const supabase = await createServerClient();
  const tenantId = await getTenantId();
  if (!tenantId) return { error: "Unauthorized." };

  const title = (formData.get("title") as string)?.trim();
  const starts_at = formData.get("starts_at") as string;

  if (!title) return { error: "Title is required." };
  if (!starts_at) return { error: "Start date is required." };

  const { error } = await supabase.from("events").insert({
    tenant_id: tenantId,
    title,
    description: (formData.get("description") as string)?.trim() || null,
    starts_at: new Date(starts_at).toISOString(),
    ends_at: formData.get("ends_at") ? new Date(formData.get("ends_at") as string).toISOString() : null,
    location: (formData.get("location") as string)?.trim() || null,
    url: (formData.get("url") as string)?.trim() || null,
    is_published: formData.get("is_published") === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/[locale]/dashboard/events", "page");
  return { success: true };
}

export async function updateEvent(_prev: EventState, formData: FormData): Promise<EventState> {
  const supabase = await createServerClient();
  const tenantId = await getTenantId();
  if (!tenantId) return { error: "Unauthorized." };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const starts_at = formData.get("starts_at") as string;

  if (!id) return { error: "Invalid event ID." };
  if (!title) return { error: "Title is required." };
  if (!starts_at) return { error: "Start date is required." };

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: (formData.get("description") as string)?.trim() || null,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: formData.get("ends_at") ? new Date(formData.get("ends_at") as string).toISOString() : null,
      location: (formData.get("location") as string)?.trim() || null,
      url: (formData.get("url") as string)?.trim() || null,
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) return { error: error.message };
  revalidatePath("/[locale]/dashboard/events", "page");
  return { success: true };
}

export async function deleteEvent(id: string): Promise<EventState> {
  const supabase = await createServerClient();
  const tenantId = await getTenantId();
  if (!tenantId) return { error: "Unauthorized." };

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) return { error: error.message };
  revalidatePath("/[locale]/dashboard/events", "page");
  return { success: true };
}

export async function togglePublished(id: string, current: boolean): Promise<EventState> {
  const supabase = await createServerClient();
  const tenantId = await getTenantId();
  if (!tenantId) return { error: "Unauthorized." };

  const { error } = await supabase
    .from("events")
    .update({ is_published: !current, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) return { error: error.message };
  revalidatePath("/[locale]/dashboard/events", "page");
  return { success: true };
}
