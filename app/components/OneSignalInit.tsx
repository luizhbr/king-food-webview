"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type OneSignal from "react-onesignal";

/** OneSignal App ID — King Food Web (dashboard). */
const ONESIGNAL_APP_ID = "e90639e9-b491-4a86-8e05-1c7c7244bba5";
const DISMISS_KEY = "kf_push_banner_dismissed";

type Status = "loading" | "ready" | "subscribed" | "blocked" | "unsupported" | "error";
type OS = typeof OneSignal;

/**
 * OneSignal Web Push integrado ao SW PWA (/sw.js com importScripts OneSignal).
 * Banner com botão — browsers exigem gesto do usuário.
 * Dashboard: Site URL = origin atual; path SW padrão OneSignalSDKWorker.js (alias → /sw.js).
 */
export default function OneSignalInit() {
  const [status, setStatus] = useState<Status>("loading");
  const [showBanner, setShowBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const osRef = useRef<OS | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    let cancelled = false;
    const showLater = (ms: number) => {
      window.setTimeout(() => {
        if (!cancelled && sessionStorage.getItem(DISMISS_KEY) !== "1") {
          setShowBanner(true);
        }
      }, ms);
    };

    (async () => {
      try {
        if (Notification.permission === "denied") {
          setStatus("blocked");
          showLater(1200);
          return;
        }

        const mod = await import("react-onesignal");
        const OS = mod.default;
        if (cancelled) return;

        try {
          await OS.Debug.setLogLevel("debug");
        } catch {
          /* ignore */
        }

        // SW unificado: /sw.js já tem importScripts OneSignal (mesmo worker do PWA)
        await OS.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "sw.js",
          serviceWorkerParam: { scope: "/" },
          allowLocalhostAsSecureOrigin: true,
        } as unknown as Parameters<OS["init"]>[0]);

        if (cancelled) return;
        osRef.current = OS;

        const optedIn = OS.User?.PushSubscription?.optedIn === true;
        if (optedIn) {
          setStatus("subscribed");
          return;
        }

        const perm = String(Notification.permission);
        if (perm === "denied") {
          setStatus("blocked");
          showLater(1200);
          return;
        }

        setStatus("ready");
        showLater(2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[KF OneSignal] init failed", err);
        if (!cancelled) {
          setErrMsg(msg.slice(0, 140));
          setStatus("error");
          // Mostra banner mesmo com erro pra debug + retry
          showLater(800);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enablePush = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setErrMsg("");
    try {
      let OS = osRef.current;
      if (!OS) {
        // retry init no clique
        const mod = await import("react-onesignal");
        OS = mod.default;
        await OS.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "sw.js",
          serviceWorkerParam: { scope: "/" },
          allowLocalhostAsSecureOrigin: true,
        } as unknown as Parameters<OS["init"]>[0]);
        osRef.current = OS;
      }

      try {
        await OS.Slidedown.promptPush({ force: true });
      } catch (e) {
        console.warn("[KF OneSignal] slidedown", e);
      }

      if (Notification.permission === "default") {
        await OS.Notifications.requestPermission();
      }

      if (Notification.permission === "granted") {
        try {
          await OS.User.PushSubscription.optIn();
        } catch {
          /* already */
        }
        await new Promise((r) => setTimeout(r, 1200));
        setStatus("subscribed");
        setShowBanner(false);
      } else if (Notification.permission === "denied") {
        setStatus("blocked");
      } else {
        setErrMsg("Permissão não concedida.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[KF OneSignal] enable failed", err);
      setErrMsg(msg.slice(0, 140));
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }, [busy]);

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
              Cadeado na URL → Notificações → Permitir → recarregar.
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

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-[95] px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-sm rounded-2xl border border-[#FFD100]/30 bg-black/95 backdrop-blur-xl p-3 shadow-2xl flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center text-black text-lg">
          🔔
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Ofertas e novidades</p>
          <p className="text-xs text-white/50 leading-snug">
            Ative o aviso de promo e açaí fresco.
          </p>
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
