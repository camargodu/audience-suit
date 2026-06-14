"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { saveProfileStep, saveBrandingStep, saveSocialLinkStep, finishOnboarding } from "./actions";

const PLATFORMS = ["youtube","instagram","tiktok","discord","whatsapp","telegram","website","store","other"] as const;

type Step = 1 | 2 | 3;

export default function OnboardingWizard({ locale, initialDisplayName }: { locale: string; initialDisplayName: string }) {
  const t = useTranslations("Onboarding");
  const tCommon = useTranslations("Common");

  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1e293b");
  const [platform, setPlatform] = useState<string>("youtube");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  function handleStep1() {
    if (!displayName.trim()) { setError(`${t("displayName")} ${tCommon("required").toLowerCase()}.`); return; }
    setError(null);
    const fd = new FormData();
    fd.append("displayName", displayName.trim());
    fd.append("description", description.trim());
    startTransition(async () => {
      const res = await saveProfileStep(fd);
      if (res?.error) { setError(res.error); return; }
      setStep(2);
    });
  }

  function handleStep2() {
    if (!/^#[0-9a-fA-F]{6}$/.test(primaryColor)) { setError("Use a valid hex color, e.g. #0d9488"); return; }
    setError(null);
    const fd = new FormData();
    fd.append("primaryColor", primaryColor);
    startTransition(async () => {
      const res = await saveBrandingStep(fd);
      if (res?.error) { setError(res.error); return; }
      setStep(3);
    });
  }

  function handleFinish(skip: boolean) {
    setError(null);
    startTransition(async () => {
      if (!skip) {
        if (!linkUrl.trim()) { setError(`${t("url")} ${tCommon("required").toLowerCase()}.`); return; }
        const fd = new FormData();
        fd.append("platform", platform);
        fd.append("url", linkUrl.trim());
        fd.append("label", linkLabel.trim());
        const res = await saveSocialLinkStep(fd);
        if (res?.error) { setError(res.error); return; }
      }
      await finishOnboarding(locale);
    });
  }

  const stepMeta: Record<Step, { title: string; subtitle: string }> = {
    1: { title: t("step1Title"), subtitle: t("step1Subtitle") },
    2: { title: t("step2Title"), subtitle: t("step2Subtitle") },
    3: { title: t("step3Title"), subtitle: t("step3Subtitle") },
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              s === step ? "bg-brand-accent text-white" : s < step ? "bg-teal-100 text-brand-accent" : "bg-slate-200 text-slate-400"
            }`}>
              {s < step ? "✓" : s}
            </div>
            {s < 3 && <div className={`h-px w-10 ${s < step ? "bg-brand-accent" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900">{stepMeta[step].title}</h2>
      <p className="mb-6 mt-1 text-sm text-slate-500">{stepMeta[step].subtitle}</p>

      {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("displayName")} <span className="text-red-500">*</span>
            </label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("description")}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder={t("descriptionPlaceholder")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
          <button onClick={handleStep1} disabled={isPending}
            className="w-full rounded-md bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {isPending ? `${tCommon("saving")}` : `${tCommon("next")} →`}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("primaryColor")}</label>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-slate-300 p-0.5" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setError(null); setStep(1); }}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              ← {tCommon("back")}
            </button>
            <button onClick={handleStep2} disabled={isPending}
              className="flex-1 rounded-md bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isPending ? tCommon("saving") : `${tCommon("next")} →`}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("platform")}</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent">
              {PLATFORMS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("url")}</label>
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t("urlPlaceholder")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Label <span className="font-normal text-slate-400">({tCommon("skip").toLowerCase()})</span>
            </label>
            <input type="text" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setError(null); setStep(2); }}
              className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              ← {tCommon("back")}
            </button>
            <button onClick={() => handleFinish(false)} disabled={isPending}
              className="flex-1 rounded-md bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isPending ? tCommon("saving") : tCommon("finish")}
            </button>
          </div>
          <button onClick={() => handleFinish(true)} disabled={isPending}
            className="w-full text-center text-sm text-slate-400 hover:text-slate-600">
            {t("skipLink")}
          </button>
        </div>
      )}
    </div>
  );
}
