"use client";

import { useState, useEffect } from "react";

interface Props {
  primaryColor?: string;
  labels: {
    enable: string;
    disable: string;
    blocked: string;
    loading: string;
  };
}

export default function PushSubscribeButton({ primaryColor, labels }: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      setBlocked(true);
      setReady(true);
      return;
    }

    const check = setInterval(() => {
      const OS = (window as any).OneSignal;
      if (OS?.User?.PushSubscription) {
        setSubscribed(OS.User.PushSubscription.optedIn ?? false);
        setReady(true);
        clearInterval(check);

        OS.User.PushSubscription.addEventListener("change", (e: any) => {
          setSubscribed(e.current?.optedIn ?? false);
        });
      }
    }, 500);

    return () => clearInterval(check);
  }, []);

  if (!ready) return null;

  const bg = primaryColor ?? "#0d9488";

  if (blocked) {
    return (
      <p className="rounded-xl border border-slate-200 px-6 py-4 text-center text-sm text-slate-500">
        {labels.blocked}
      </p>
    );
  }

  async function handleClick() {
    const OS = (window as any).OneSignal;
    if (!OS) return;
    setLoading(true);
    try {
      if (subscribed) {
        await OS.User.PushSubscription.optOut();
        setSubscribed(false);
      } else {
        await OS.Notifications.requestPermission();
        await OS.User.PushSubscription.optIn();
        setSubscribed(true);
      }
    } catch (e) {
      console.warn("Push toggle failed:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60"
      style={{ backgroundColor: bg }}
    >
      {loading ? labels.loading : subscribed ? labels.disable : labels.enable}
    </button>
  );
}
