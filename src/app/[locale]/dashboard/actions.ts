"use server";

import { createServerClient } from "@/lib/supabase/ssr";
import { redirect } from "next/navigation";

export async function signOut(locale: string) {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/auth/login`);
}
