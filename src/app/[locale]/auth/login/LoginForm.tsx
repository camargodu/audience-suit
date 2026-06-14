"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { login, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Auth");
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
    >
      {pending ? t("signingIn") : t("signIn")}
    </button>
  );
}

export default function LoginForm({
  locale,
  nextPath,
  initialError,
}: {
  locale: string;
  nextPath: string;
  initialError?: string;
}) {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const [state, formAction] = useActionState<LoginState, FormData>(login, null);
  const errorMsg = state?.error ?? initialError;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">{tCommon("appName")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("signIn")}</p>
        </div>

        {errorMsg && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={nextPath} />

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
              id="password" name="password" type="password" required autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-center text-sm text-slate-500">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/auth/signup`} className="font-medium text-brand-accent hover:opacity-80">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </main>
  );
}
