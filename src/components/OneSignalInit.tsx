"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}

function isOneSignalPushError(value: unknown): boolean {
  const msg =
    typeof value === "string"
      ? value
      : value instanceof Error
      ? value.message
      : typeof (value as any)?.message === "string"
      ? (value as any).message
      : "";
  return msg.includes("Registration failed") || msg.includes("push service not available");
}

export default function OneSignalInit({ tenantSlug }: { tenantSlug: string }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;

    // The Next.js dev overlay catches both console.error and unhandledrejection.
    // OneSignal's push service registration fails on HTTP/localhost (expected) and
    // surfaces through both channels, so we suppress both.
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (args.some(isOneSignalPushError)) return;
      originalError.apply(console, args);
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isOneSignalPushError(e.reason)) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", handleRejection);

    window.OneSignalDeferred = window.OneSignalDeferred ?? [];

    if (!document.getElementById("onesignal-sdk")) {
      const script = document.createElement("script");
      script.id = "onesignal-sdk";
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.defer = true;
      document.head.appendChild(script);
    }

    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: "/" },
          notifyButton: { enable: false },
        });
        OneSignal.User.addTag("tenant_slug", tenantSlug);
      } catch (e) {
        if (!isOneSignalPushError(e)) console.warn("OneSignal init failed:", e);
      }
    });

    return () => {
      console.error = originalError;
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [tenantSlug]);

  return null;
}
