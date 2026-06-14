const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY!;

export async function sendPushToTenant({
  tenantSlug,
  title,
  message,
  url,
}: {
  tenantSlug: string;
  title: string;
  message: string;
  url?: string;
}) {
  const res = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${API_KEY}`,
    },
    body: JSON.stringify({
      app_id: APP_ID,
      filters: [
        { field: "tag", key: "tenant_slug", relation: "=", value: tenantSlug },
      ],
      headings: { en: title },
      contents: { en: message },
      ...(url ? { url } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { errors?: string[] }).errors?.[0] ?? "OneSignal request failed"
    );
  }

  return res.json();
}
