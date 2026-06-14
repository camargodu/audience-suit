"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateProfile, type ProfileState } from "./actions";

interface ProfileData {
  displayName: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export default function ProfileForm({ locale, profile }: { locale: string; profile: ProfileData }) {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(updateProfile, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {t("displayName")} <span className="text-red-500">*</span>
        </label>
        <input type="text" name="displayName" defaultValue={profile.displayName} required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t("description")}</label>
        <textarea name="description" defaultValue={profile.description ?? ""} rows={3}
          placeholder={t("descriptionPlaceholder")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("logoUrl")}</label>
          <input type="url" name="logoUrl" defaultValue={profile.logoUrl ?? ""} placeholder={t("logoUrlPlaceholder")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("bannerUrl")}</label>
          <input type="url" name="bannerUrl" defaultValue={profile.bannerUrl ?? ""} placeholder={t("bannerUrlPlaceholder")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("primaryColor")}</label>
          <div className="flex items-center gap-2">
            <input type="color" name="primaryColorPicker" defaultValue={profile.primaryColor}
              onChange={(e) => { const inp = e.currentTarget.closest("div")?.querySelector<HTMLInputElement>('input[name="primaryColor"]'); if (inp) inp.value = e.currentTarget.value; }}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 p-0.5" />
            <input type="text" name="primaryColor" defaultValue={profile.primaryColor}
              className="w-28 rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("secondaryColor")}</label>
          <div className="flex items-center gap-2">
            <input type="color" name="secondaryColorPicker" defaultValue={profile.secondaryColor}
              onChange={(e) => { const inp = e.currentTarget.closest("div")?.querySelector<HTMLInputElement>('input[name="secondaryColor"]'); if (inp) inp.value = e.currentTarget.value; }}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 p-0.5" />
            <input type="text" name="secondaryColor" defaultValue={profile.secondaryColor}
              className="w-28 rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>
        </div>
      </div>

      {state?.error && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>}
      {state?.success && <div className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">{t("saved")}</div>}

      <button type="submit" disabled={isPending}
        className="rounded-md bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
        {isPending ? tCommon("saving") : tCommon("save")}
      </button>
    </form>
  );
}
