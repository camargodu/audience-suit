"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signUp, type SignupState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Auth");
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
    >
      {pending ? t("creatingAccount") : t("signUp")}
    </button>
  );
}

export default function SignupForm({ locale }: { locale: string }) {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const [state, formAction] = useActionState<SignupState, FormData>(signUp, null);

  if (state && "success" in state) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t("checkInbox")}</h1>
          <p className="text-sm text-slate-600">{state.message}</p>
          <Link href={`/${locale}/auth/login`} className="inline-block text-sm font-medium text-brand-accent hover:opacity-80">
            {t("backToSignIn")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">{tCommon("appName")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("signUp")}</p>
        </div>

        {state?.error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">{t("creatorName")}</label>
            <input
              id="displayName" name="displayName" type="text" required autoComplete="name"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">{t("email")}</label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">{t("password")}</label>
            <input
              id="password" name="password" type="password" required autoComplete="new-password" minLength={6}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-center text-sm text-slate-500">
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/auth/login`} className="font-medium text-brand-accent hover:opacity-80">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}
