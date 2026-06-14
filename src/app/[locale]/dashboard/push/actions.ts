"use server";

import { createServerClient } from "@/lib/supabase/ssr";
import { sendPushToTenant } from "@/lib/onesignal";

export type PushState = { error: string } | { success: true; recipients: number } | null;

export async function sendPush(_prev: PushState, formData: FormData): Promise<PushState> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!userRow) return { error: "Account not found." };

  const { data: tenant } = await supabase
    .from("tenants")
    .select("slug")
    .eq("id", userRow.tenant_id)
    .single();

  if (!tenant) return { error: "Hub not found." };

  const title = (formData.get("title") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();

  if (!title) return { error: "Title is required." };
  if (!message) return { error: "Message is required." };

  try {
    const result = await sendPushToTenant({
      tenantSlug: tenant.slug,
      title,
      message,
      url: url || undefined,
    });

    return { success: true, recipients: result.recipients ?? 0 };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
