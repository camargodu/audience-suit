import type { Locale } from "@/i18n/config";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { next, error } = await searchParams;
  const nextPath = next ?? `/${locale}/dashboard`;

  const errorMessages: Record<string, string> = {
    confirmation_failed: "Email confirmation failed. Please try signing in or request a new link.",
    setup_incomplete: "Account setup incomplete. Please sign in again.",
  };
  const initialError = error ? (errorMessages[error] ?? "An error occurred. Please try again.") : undefined;

  return <LoginForm locale={locale} nextPath={nextPath} initialError={initialError} />;
}
