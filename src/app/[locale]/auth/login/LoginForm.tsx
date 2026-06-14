"use client";

import { useActionState, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative mt-1">
              <input
                id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                className="block w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
