"use client";

import { useEffect } from "react";

/** OneSignal App ID — King Food Web (dashboard). */
const ONESIGNAL_APP_ID = "e90639e9-b491-4a86-8e05-1c7c7244bba5";
const PROMPT_DISMISS_KEY = "kf_push_prompt_dismissed";
const PROMPT_DELAY_MS = 18_000;

/**
 * Inicializa OneSignal Web Push sem conflitar com o SW PWA (/sw.js).
 * Worker em /push/onesignal/ (scope isolado).
 * Prompt nativo só após delay e se ainda default — não na 1ª tela.
 */
export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    (async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;
        if (cancelled) return;

        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/push/onesignal/" },
          allowLocalhostAsSecureOrigin: true,
        } as Parameters<typeof OneSignal.init>[0]);

        if (cancelled) return;

        // Soft prompt: só se permissão ainda default e usuário não dispensou
        const dismissed = sessionStorage.getItem(PROMPT_DISMISS_KEY) === "1";
        if (dismissed) return;
        if (Notification.permission !== "default") return;

        window.setTimeout(async () => {
          if (cancelled) return;
          if (Notification.permission !== "default") return;
          if (sessionStorage.getItem(PROMPT_DISMISS_KEY) === "1") return;
          try {
            // Slidedown se disponível; senão requestPermission direto
            const os = OneSignal as typeof OneSignal & {
              Slidedown?: { promptPush?: () => Promise<void> };
              Notifications?: { requestPermission?: () => Promise<boolean> };
            };
            if (os.Slidedown?.promptPush) {
              await os.Slidedown.promptPush();
            } else if (os.Notifications?.requestPermission) {
              await os.Notifications.requestPermission();
            }
          } catch {
            /* user closed / blocked */
          }
        }, PROMPT_DELAY_MS);
      } catch {
        /* SDK fail silently — não quebra pedido */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
