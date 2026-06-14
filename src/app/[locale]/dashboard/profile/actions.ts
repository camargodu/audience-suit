"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/ssr";

export type ProfileState = { error?: string; success?: boolean } | null;

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const displayName = (formData.get("displayName") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const logoUrl = (formData.get("logoUrl") as string)?.trim();
  const bannerUrl = (formData.get("bannerUrl") as string)?.trim();
  const primaryColor = (formData.get("primaryColor") as string)?.trim();
  const secondaryColor = (formData.get("secondaryColor") as string)?.trim();
  const locale = formData.get("locale") as string;

  if (!displayName) return { error: "Display name is required." };

  const hexPattern = /^#[0-9a-fA-F]{6}$/;
  if (primaryColor && !hexPattern.test(primaryColor)) {
    return { error: "Primary color must be a valid hex value (e.g. #0d9488)." };
  }
  if (secondaryColor && !hexPattern.test(secondaryColor)) {
    return { error: "Secondary color must be a valid hex value (e.g. #ffffff)." };
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!userRow) return { error: "User profile not found." };

  const { error } = await supabase
    .from("creator_profiles")
    .update({
      display_name: displayName,
      description: description || null,
      logo_url: logoUrl || null,
      banner_url: bannerUrl || null,
      primary_color: primaryColor || "#1e293b",
      secondary_color: secondaryColor || "#ffffff",
    })
    .eq("tenant_id", userRow.tenant_id);

  if (error) return { error: "Failed to save profile." };

  revalidatePath(`/${locale}/dashboard/profile`);
  revalidatePath(`/api/v1/tenants`);
  return { success: true };
}
