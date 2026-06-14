"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { createEvent, updateEvent, deleteEvent, togglePublished, type EventState } from "./actions";

type Event = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  url: string | null;
  is_published: boolean;
};

function toLocalDatetime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const tCommon = useTranslations("Common");
  return (
    <button type="submit" disabled={pending}
      className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
      {pending ? tCommon("saving") : label}
    </button>
  );
}

function EventForm({ event, onCancel }: { event?: Event; onCancel: () => void }) {
  const t = useTranslations("Events");
  const tCommon = useTranslations("Common");
  const action = event ? updateEvent : createEvent;
  const [state, formAction] = useActionState<EventState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{event ? t("editEvent") : t("newEvent")}</h3>

      {state && "error" in state && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{t("saved")}</p>
      )}

      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">{t("titleLabel")} *</label>
          <input name="title" required defaultValue={event?.title}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">{t("descriptionLabel")}</label>
          <textarea name="description" rows={2} defaultValue={event?.description ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t("startDate")} *</label>
          <input name="starts_at" type="datetime-local" required defaultValue={event ? toLocalDatetime(event.starts_at) : ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t("endDate")}</label>
          <input name="ends_at" type="datetime-local" defaultValue={event?.ends_at ? toLocalDatetime(event.ends_at) : ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t("location")}</label>
          <input name="location" defaultValue={event?.location ?? ""} placeholder={t("locationPlaceholder")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t("url")}</label>
          <input name="url" type="url" defaultValue={event?.url ?? ""} placeholder="https://..."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={event?.is_published ?? false}
          className="h-4 w-4 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
        <span className="font-medium text-slate-700">{t("publishLabel")}</span>
      </label>

      <div className="flex gap-3">
        <SubmitButton label={event ? tCommon("save") : t("newEvent")} />
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
          {tCommon("cancel")}
        </button>
      </div>
    </form>
  );
}

function EventRow({ event }: { event: Event }) {
  const t = useTranslations("Events");
  const tCommon = useTranslations("Common");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (editing) {
    return <EventForm event={event} onCancel={() => setEditing(false)} />;
  }

  const start = new Date(event.starts_at).toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">{event.title}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              event.is_published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            }`}>
              {event.is_published ? t("published") : t("draft")}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{start}{event.location ? ` · ${event.location}` : ""}</p>
          {event.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{event.description}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => togglePublished(event.id, event.is_published)}
            className="text-xs font-medium text-brand-accent hover:opacity-70">
            {event.is_published ? t("unpublish") : t("publish")}
          </button>
          <button onClick={() => setEditing(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-900">
            {t("editEvent")}
          </button>
          <button onClick={() => { setDeleting(true); deleteEvent(event.id); }} disabled={deleting}
            className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50">
            {deleting ? t("deleting") : tCommon("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsManager({ events }: { events: Event[] }) {
  const t = useTranslations("Events");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + {t("newEvent")}
        </button>
      )}

      {showForm && <EventForm onCancel={() => setShowForm(false)} />}

      {events.length === 0 && !showForm && (
        <p className="text-sm text-slate-400">{t("noEvents")}</p>
      )}

      {events.map((ev) => (
        <EventRow key={ev.id} event={ev} />
      ))}
    </div>
  );
}
