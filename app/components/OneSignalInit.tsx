"use client";

import { useEffect, useState, useCallback } from "react";
import type OneSignal from "react-onesignal";

/** OneSignal App ID — King Food Web (dashboard). */
const ONESIGNAL_APP_ID = "e90639e9-b491-4a86-8e05-1c7c7244bba5";
const DISMISS_KEY = "kf_push_banner_dismissed";

type Status = "loading" | "ready" | "subscribed" | "blocked" | "unsupported" | "error";
type OS = typeof OneSignal;

/**
 * OneSignal Web Push — worker em /push/onesignal/ (não conflita com /sw.js).
 * Browsers exigem gesto do usuário para o prompt nativo: banner com botão.
 * Site URL no dashboard OneSignal DEVE ser o mesmo origin (preview ou kingfood.online).
 */
export default function OneSignalInit() {
  const [status, setStatus] = useState<Status>("loading");
  const [showBanner, setShowBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [onesignal, setOnesignal] = useState<OS | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const mod = await import("react-onesignal");
        const OS = mod.default;
        if (cancelled) return;

        try {
          await OS.Debug.setLogLevel("warn");
        } catch {
          /* ignore */
        }

        await OS.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/push/onesignal/" },
          allowLocalhostAsSecureOrigin: true,
        } as Parameters<OS["init"]>[0]);

        if (cancelled) return;
        setOnesignal(OS);

        const perm = Notification.permission;
        if (perm === "denied") {
          setStatus("blocked");
          return;
        }

        const optedIn = OS.User?.PushSubscription?.optedIn === true;
        if (optedIn || perm === "granted") {
          setStatus("subscribed");
          return;
        }

        setStatus("ready");
        const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
        if (!dismissed) {
          window.setTimeout(() => {
            if (!cancelled) setShowBanner(true);
          }, 4_000);
        }
      } catch (err) {
        console.error("[KF OneSignal] init failed", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enablePush = useCallback(async () => {
    if (!onesignal || busy) return;
    setBusy(true);
    try {
      try {
        await onesignal.Slidedown.promptPush({ force: true });
      } catch {
        /* fallback */
      }

      if (Notification.permission === "default") {
        await onesignal.Notifications.requestPermission();
      }

      if (Notification.permission === "granted") {
        try {
          await onesignal.User.PushSubscription.optIn();
        } catch {
          /* already */
        }
        setStatus("subscribed");
        setShowBanner(false);
      } else if (Notification.permission === "denied") {
        setStatus("blocked");
        setShowBanner(false);
      }
    } catch (err) {
      console.error("[KF OneSignal] enable failed", err);
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }, [onesignal, busy]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setShowBanner(false);
  };

  if (!showBanner || status === "subscribed" || status === "unsupported") {
    return null;
  }

  if (status === "blocked") {
    return (
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-[95] px-4 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-sm rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-3 shadow-2xl flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Notificações bloqueadas</p>
            <p className="text-xs text-white/50 mt-0.5 leading-snug">
              No Chrome: cadeado ao lado da URL → Notificações → Permitir.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white/40"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (status !== "ready" && status !== "error") return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-[95] px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-sm rounded-2xl border border-[#FFD100]/30 bg-black/95 backdrop-blur-xl p-3 shadow-2xl flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center text-black text-lg">
          🔔
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Ofertas e novidades</p>
          <p className="text-xs text-white/50 leading-snug">
            Ative o aviso quando tiver promo ou açaí fresco.
          </p>
          {status === "error" && (
            <p className="text-[10px] text-red-400 mt-1">
              Falha ao conectar. Confira Site URL no OneSignal = este domínio.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={enablePush}
          disabled={busy}
          className="shrink-0 min-h-[40px] rounded-xl bg-[#FFD100] px-3 py-2 text-xs font-bold text-black active:scale-95 transition disabled:opacity-60"
        >
          {busy ? "..." : "Ativar"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white/30"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
