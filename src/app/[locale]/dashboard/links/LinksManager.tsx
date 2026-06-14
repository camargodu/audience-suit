"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { addLink, toggleLink, deleteLink, type LinkState } from "./actions";

const PLATFORMS = ["youtube","instagram","tiktok","discord","whatsapp","telegram","website","store","other"] as const;
const PLATFORM_LABELS: Record<string, string> = {
  youtube:"YouTube", instagram:"Instagram", tiktok:"TikTok", discord:"Discord",
  whatsapp:"WhatsApp", telegram:"Telegram", website:"Website", store:"Store", other:"Other",
};
const PLATFORM_ICONS: Record<string, string> = {
  youtube:"▶", instagram:"📷", tiktok:"🎵", discord:"💬", whatsapp:"📱", telegram:"✈", store:"🛒",
};

interface SocialLink { id:string; platform:string; label:string|null; url:string; is_active:boolean; sort_order:number; }

export default function LinksManager({ locale, links }: { locale:string; links:SocialLink[] }) {
  const t = useTranslations("Links");
  const tCommon = useTranslations("Common");
  const [addState, addAction, isAdding] = useActionState<LinkState, FormData>(addLink, null);
  const [showForm, setShowForm] = useState(links.length === 0);
  const [pendingId, setPendingId] = useState<string|null>(null);

  async function handleToggle(id:string, current:boolean) {
    setPendingId(id);
    await toggleLink(id, !current, locale);
    setPendingId(null);
  }

  async function handleDelete(id:string) {
    if (!confirm(`${tCommon("delete")}?`)) return;
    setPendingId(id);
    await deleteLink(id, locale);
    setPendingId(null);
  }

  return (
    <div className="space-y-6">
      {links.length > 0 ? (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
          {links.map((link) => (
            <li key={link.id} className="flex items-center gap-4 px-5 py-4">
              <span className="w-6 text-center text-lg">{PLATFORM_ICONS[link.platform] ?? "🔗"}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">{link.label || PLATFORM_LABELS[link.platform] || link.platform}</p>
                <p className="truncate text-xs text-slate-400">{link.url}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggle(link.id, link.is_active)} disabled={pendingId === link.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${link.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {link.is_active ? t("active") : t("inactive")}
                </button>
                <button onClick={() => handleDelete(link.id)} disabled={pendingId === link.id}
                  className="text-sm text-slate-400 hover:text-red-500 disabled:opacity-50">
                  {tCommon("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">{t("noLinks")}</p>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          + {t("addLink")}
        </button>
      )}

      {showForm && (
        <form action={(fd) => { fd.append("locale", locale); addAction(fd); if (!addState?.error) setShowForm(false); }}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">{t("addLink")}</h3>
          <input type="hidden" name="locale" value={locale} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{t("platform")}</label>
              <select name="platform" defaultValue="youtube"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent">
                {PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{t("label")}</label>
              <input type="text" name="label" placeholder="e.g. My YouTube"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{t("url")} *</label>
            <input type="url" name="url" required placeholder="https://"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
          </div>

          {addState?.error && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{addState.error}</div>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              {tCommon("cancel")}
            </button>
            <button type="submit" disabled={isAdding}
              className="rounded-md bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isAdding ? tCommon("saving") : t("addLink")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
