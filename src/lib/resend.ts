import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFanWelcomeEmail({
  fanEmail,
  fanName,
  creatorName,
  primaryColor,
  hubUrl,
}: {
  fanEmail: string;
  fanName: string | null;
  creatorName: string;
  primaryColor: string;
  hubUrl: string;
}) {
  const greeting = fanName ? `Hey ${fanName}` : "Hey";
  const color = primaryColor || "#0d9488";

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@audiencesuite.com",
    to: fanEmail,
    subject: `Welcome to ${creatorName}'s hub`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="font-family:sans-serif;background:#f8fafc;margin:0;padding:40px 16px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:${color};padding:32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">${creatorName}</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 12px;">${greeting} 👋</p>
      <p style="color:#475569;font-size:15px;margin:0 0 24px;line-height:1.6;">
        You're now part of <strong>${creatorName}</strong>'s community.
        Come back anytime to check schedules, links and updates.
      </p>
      <a href="${hubUrl}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;">
        Visit the hub →
      </a>
    </div>
    <div style="border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        You received this because you joined ${creatorName}'s hub.
        Powered by <a href="https://audiencesuite.com" style="color:#0d9488;text-decoration:none;">Audience Suite</a>.
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}
