import type { Locale } from "@/i18n/config";
import SignupForm from "./SignupForm";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <SignupForm locale={locale} />;
}
