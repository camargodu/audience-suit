"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { sendPush, type PushState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Push");
  return (
    <button type="submit" disabled={pending}
      className="rounded-lg bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
      {pending ? t("sending") : t("send")}
    </button>
  );
}

export default function PushForm() {
  const t = useTranslations("Push");
  const [state, formAction] = useActionState<PushState, FormData>(sendPush, null);

  return (
    <form action={formAction} className="space-y-5">
      {state && "error" in state && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ {t("sent", { recipients: state.recipients })}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          {t("titleLabel")} <span className="text-red-500">*</span>
        </label>
        <input id="title" name="title" type="text" required maxLength={100}
          placeholder={t("titlePlaceholder")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          {t("messageLabel")} <span className="text-red-500">*</span>
        </label>
        <textarea id="message" name="message" required maxLength={300} rows={3}
          placeholder={t("messagePlaceholder")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-700">
          {t("urlLabel")} <span className="text-xs text-slate-400">{t("urlOptional")}</span>
        </label>
        <input id="url" name="url" type="url" placeholder="https://"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        <p className="mt-1 text-xs text-slate-400">{t("urlNote")}</p>
      </div>

      <SubmitButton />
    </form>
  );
}
