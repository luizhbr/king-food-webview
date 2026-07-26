"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  if (isInstalled) return null;

  if (isIOS && !deferredPrompt) {
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed) return null;

    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up rounded-2xl border border-white/10 bg-brand-acaiDark p-4 shadow-2xl md:left-auto md:right-4 md:w-96">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">📱</div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-white">Instale o App</h3>
            <p className="mt-1 text-sm text-brand-cream/70">
              Para instalar no iPhone: toque no botão de compartilhar e depois em
              <strong className="text-brand-gold"> "Adicionar à Tela de Início"</strong>.
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleDismiss}
            className="rounded-lg px-4 py-2 text-sm text-brand-cream/50 transition-colors hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up rounded-2xl border border-white/10 bg-brand-acaiDark p-4 shadow-2xl md:left-auto md:right-4 md:w-96">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 text-3xl">📱</div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-white">Instale o King Food</h3>
          <p className="text-sm text-brand-cream/70">Acesso rápido direto da sua tela inicial</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleDismiss}
          className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-brand-cream/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          Agora não
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-acaiDark transition-colors hover:bg-brand-goldDark"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
