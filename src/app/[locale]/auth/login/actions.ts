"use server";

import { createServerClient } from "@/lib/supabase/ssr";
import { redirect } from "next/navigation";

export type LoginState = { error: string } | null;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "en";
  const next = (formData.get("next") as string) || `/${locale}/dashboard`;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // redirect() throws internally — Next.js catches and navigates.
  redirect(next.startsWith("/") ? next : `/${locale}/dashboard`);
}
