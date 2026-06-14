"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const storageKey = (slug: string) => `fan_joined_${slug}`;

export default function FanRegistrationForm({
  slug,
  primaryColor = "#1e293b",
}: {
  slug: string;
  primaryColor?: string;
}) {
  const t = useTranslations("Fan");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(storageKey(slug))) {
      setAlreadyJoined(true);
    }
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!termsChecked) { setErrorMsg(t("termsRequired")); return; }

    setStatus("pending");
    setErrorMsg(null);

    const consents = ["terms"];
    if (marketingChecked) consents.push("email_marketing");

    try {
      const res = await fetch(`/api/v1/tenants/${slug}/fans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), consents }),
      });

      if (res.ok) {
        localStorage.setItem(storageKey(slug), "1");
        setStatus("success");
      } else {
        const json = await res.json().catch(() => ({}));
        const messages: Record<string, string> = {
          email_required: t("emailRequired"),
          invalid_email: t("invalidEmail"),
          terms_required: t("termsRequired"),
          registration_failed: t("failed"),
        };
        setErrorMsg(messages[json.error] ?? t("failed"));
        setStatus("error");
      }
    } catch {
      setErrorMsg(t("failed"));
      setStatus("error");
    }
  }

  if (alreadyJoined || status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-6 text-center">
        <p className="font-semibold text-green-800">{t("successTitle")}</p>
        <p className="mt-1 text-sm text-green-700">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
      <h2 className="text-base font-semibold text-slate-800">{t("joinTitle")}</h2>

      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
        placeholder={t("namePlaceholder")}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-current focus:outline-none focus:ring-1 focus:ring-current" />

      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")} required
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-current focus:outline-none focus:ring-1 focus:ring-current" />

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} className="mt-0.5 shrink-0" />
        <span>
          {t.rich("termsLabel", {
            terms: (chunks) => <span className="cursor-pointer underline">{chunks}</span>,
            privacy: (chunks) => <span className="cursor-pointer underline">{chunks}</span>,
          })}{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" checked={marketingChecked} onChange={(e) => setMarketingChecked(e.target.checked)} className="mt-0.5 shrink-0" />
        <span>{t("marketingLabel")}</span>
      </label>

      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={status === "pending"}
        className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow disabled:opacity-60"
        style={{ backgroundColor: primaryColor }}>
        {status === "pending" ? t("signingUp") : t("signUp")}
      </button>
    </form>
  );
}
