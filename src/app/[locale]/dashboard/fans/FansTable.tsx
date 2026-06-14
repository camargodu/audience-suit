"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export interface FanRow {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  consents: { purpose: string; granted: boolean }[];
}

function hasConsent(fan: FanRow, purpose: string) {
  return fan.consents.some((c) => c.purpose === purpose && c.granted);
}

export default function FansTable({ fans, locale }: { fans: FanRow[]; locale: string }) {
  const t = useTranslations("Fans");
  const [filter, setFilter] = useState<"all" | "email" | "push">("all");

  const filtered = fans.filter((f) => {
    if (filter === "email") return hasConsent(f, "email_marketing");
    if (filter === "push") return hasConsent(f, "push_notification");
    return true;
  });

  function exportCsv() {
    const header = ["name", "email", "joined_at", "terms", "email_marketing", "push_notification"];
    const rows = fans.map((f) => [
      f.name ?? "",
      f.email,
      new Date(f.created_at).toISOString(),
      hasConsent(f, "terms") ? "yes" : "no",
      hasConsent(f, "email_marketing") ? "yes" : "no",
      hasConsent(f, "push_notification") ? "yes" : "no",
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fans-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["all", "email", "push"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filter === f
                  ? "bg-brand-accent text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? t("filterAll") : f === "email" ? t("filterEmail") : t("filterPush")}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          {t("exportCsv")} ↓
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">{t("noFans")}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">{t("colName")}</th>
                <th className="px-4 py-3 text-left">{t("colEmail")}</th>
                <th className="px-4 py-3 text-left">{t("colJoined")}</th>
                <th className="px-4 py-3 text-center">{t("colTerms")}</th>
                <th className="px-4 py-3 text-center">{t("colEmailMarketing")}</th>
                <th className="px-4 py-3 text-center">{t("colPush")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((fan) => (
                <tr key={fan.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {fan.name || <span className="italic text-slate-400">{t("anonymous")}</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{fan.email}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(fan.created_at).toLocaleDateString(locale, {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasConsent(fan, "terms") ? "✓" : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasConsent(fan, "email_marketing") ? "✓" : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasConsent(fan, "push_notification") ? "✓" : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
