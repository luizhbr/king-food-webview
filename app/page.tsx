"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MENU_URL = "https://kingfood.fe-v2.ola.click/products";
const WA_URL = "https://wa.me/12673107535";
const GROUP_URL = "https://chat.whatsapp.com/LtoVNE9AJ2u2nlrlruTxhd";
const MAPS_URL = "https://maps.app.goo.gl/GR2gpipSMqZdH9Xy5";
const INSTAGRAM_URL = "https://instagram.com/king.food_delivery";
const LOGO = "/logo-kingfood.png.png";
const INSTALL_DISMISS_KEY = "kf_install_dismissed";

type Tab = "home" | "menu" | "hours";

const SIDE_LINKS: {
  label: string;
  action?: "hours";
  href?: string;
}[] = [
  { label: "Entrar no grupo", href: GROUP_URL },
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "Horários e entrega", action: "hours" },
  { label: "Fale conosco", href: WA_URL },
];

const HOURS = [
  { day: 0, label: "Domingo", hours: "6:00 PM – 10:30 PM" },
  { day: 1, label: "Segunda-feira", hours: "7:00 PM – 10:00 PM" },
  { day: 2, label: "Terça-feira", hours: "7:00 PM – 10:30 PM" },
  { day: 3, label: "Quarta-feira", hours: "7:00 PM – 10:00 PM" },
  { day: 4, label: "Quinta-feira", hours: "7:00 PM – 10:00 PM" },
  { day: 5, label: "Sexta-feira", hours: "Fechado" },
  { day: 6, label: "Sábado", hours: "9:00 PM – 11:00 PM" },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __kfDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstallModal({
  open,
  onInstall,
  onDismiss,
}: {
  open: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/60" onClick={onDismiss} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
      >
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD100]">
          <img src={LOGO} alt="" className="h-12 w-12 object-contain" />
        </div>
        <h2 id="install-title" className="text-lg font-extrabold text-gray-900">
          Instale nosso app
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Peça mais rápido direto da tela inicial do seu celular.
        </p>
        <button
          type="button"
          onClick={onInstall}
          className="mt-5 w-full rounded-2xl bg-purple-700 py-3.5 text-sm font-bold text-white active:scale-[0.99] transition"
        >
          Instalar agora
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [iframeReady, setIframeReady] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const loadingDone = useRef(false);

  const today = new Date().getDay();

  const tryShowModal = useCallback(() => {
    const dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1";
    if (dismissed) return;
    if (!deferredPrompt.current && !window.__kfDeferredPrompt) return;
    setCanInstall(true);
    if (loadingDone.current) setShowInstallModal(true);
  }, []);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => {
      loadingDone.current = true;
      setLoading(false);
      const dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1";
      if (!dismissed && (deferredPrompt.current || window.__kfDeferredPrompt)) {
        setCanInstall(true);
        setShowInstallModal(true);
      }
    }, 1800);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || showInstallModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, showInstallModal]);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) {
      setCanInstall(false);
      setShowInstallModal(false);
      return;
    }

    const adoptPrompt = (evt: BeforeInstallPromptEvent | null | undefined) => {
      if (!evt) return;
      try {
        evt.preventDefault();
      } catch {
        /* already prevented */
      }
      deferredPrompt.current = evt;
      window.__kfDeferredPrompt = evt;
      setCanInstall(true);
      tryShowModal();
    };

    adoptPrompt(window.__kfDeferredPrompt ?? null);

    const onKfBip = () => adoptPrompt(window.__kfDeferredPrompt ?? null);
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      adoptPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      window.__kfDeferredPrompt = null;
      deferredPrompt.current = null;
      setCanInstall(false);
      setShowInstallModal(false);
    };

    window.addEventListener("kf-beforeinstallprompt", onKfBip);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("kf-beforeinstallprompt", onKfBip);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [tryShowModal]);

  const handleInstall = async () => {
    const promptEvent =
      deferredPrompt.current || (window.__kfDeferredPrompt as BeforeInstallPromptEvent | null);
    if (!promptEvent) {
      setShowInstallModal(false);
      return;
    }
    setShowInstallModal(false);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        deferredPrompt.current = null;
        window.__kfDeferredPrompt = null;
        setCanInstall(false);
      }
    } catch {
      /* ignore */
    }
  };

  const dismissInstallModal = () => {
    sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
    setShowInstallModal(false);
  };

  const openMenu = () => {
    setDrawerOpen(false);
    setIframeReady(false);
    setTab("menu");
  };

  const goHome = () => {
    setTab("home");
    setIframeReady(false);
  };

  const headerSubtitle =
    tab === "menu"
      ? "Cardápio"
      : tab === "hours"
        ? "Horários"
        : "Açaí • Delivery";

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD100]">
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out ${
              showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <img src={LOGO} alt="King Food" className="w-44 h-44 object-contain drop-shadow-md" />
          </div>
          <div
            className={`mt-8 transition-opacity duration-500 delay-300 ${
              showLogo ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <InstallModal open={showInstallModal} onInstall={handleInstall} onDismiss={dismissInstallModal} />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <header className="shrink-0 z-40 bg-black text-white">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Abrir menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
            <button type="button" onClick={goHome} className="flex items-center gap-2">
              <img src={LOGO} alt="King Food" className="w-9 h-9 object-contain rounded-md" />
              <div className="leading-tight text-left">
                <p className="font-bold text-sm">King Food</p>
                <p className="text-[10px] text-white/60">{headerSubtitle}</p>
              </div>
            </button>
          </div>
          {tab !== "home" && (
            <button
              type="button"
              onClick={goHome}
              className="text-xs font-semibold text-white/80 px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              ← Início
            </button>
          )}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-black text-white px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="King Food" className="w-10 h-10 object-contain rounded-md" />
            <div>
              <p className="font-bold">King Food</p>
              <p className="text-xs text-white/60">Menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <nav className="py-2">
          {SIDE_LINKS.map((link) =>
            link.action === "hours" ? (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setTab("hours");
                }}
                className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50 transition"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDrawerOpen(false)}
                className="block w-full text-left px-5 py-3.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50 transition"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Entrega em até 40 min • Columbus, OH</p>
        </div>
      </aside>

      {tab === "menu" ? (
        <div className="flex-1 relative min-h-0 bg-white">
          {!iframeReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white px-6">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Carregando cardápio...</p>
              <a href={MENU_URL} className="text-sm font-semibold text-purple-700 underline">
                Abrir em nova aba
              </a>
            </div>
          )}
          <iframe
            src={MENU_URL}
            className="absolute inset-0 w-full h-full border-0"
            title="Cardápio King Food"
            allow="payment"
            onLoad={() => setIframeReady(true)}
          />
        </div>
      ) : tab === "hours" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl" aria-hidden>
              🕐
            </span>
            <h2 className="text-lg font-extrabold text-black">Horários e entrega</h2>
          </div>
          <ul className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {HOURS.map((row) => {
              const isToday = row.day === today;
              const closed = row.hours === "Fechado";
              return (
                <li
                  key={row.day}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
                    isToday ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isToday ? "font-bold text-blue-700" : "font-medium text-gray-800"
                    }`}
                  >
                    {row.label}
                    {isToday ? " · hoje" : ""}
                  </span>
                  <span
                    className={`text-sm tabular-nums ${
                      isToday
                        ? "font-bold text-blue-700"
                        : closed
                          ? "text-gray-400"
                          : "text-gray-600"
                    }`}
                  >
                    {row.hours}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-900">Entrega</p>
            <p className="text-sm text-gray-600 mt-1">Em até 40 min • Columbus, OH</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-purple-700"
            >
              Ver no Google Maps →
            </a>
          </div>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-6">
          <div className="max-w-sm mx-auto flex flex-col items-center text-center">
            <img src={LOGO} alt="King Food" className="w-24 h-24 object-contain mb-3 rounded-2xl" />
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">King Food</h1>
            <p className="text-sm text-gray-500 mb-3">Açaí Premium • Columbus, OH</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              O sabor BR que dá um tapa na saudade. Açaí brasileiro feito com ingredientes premium.
              Delivery e retirada em Columbus.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Authentic Brazilian açaí — premium ingredients, delivered with care in Columbus, OH.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-gray-600">
              <span className="flex flex-col items-center gap-1">
                <span className="text-2xl" aria-hidden>
                  🧳
                </span>
                Retirada
              </span>
              <span className="flex flex-col items-center gap-1">
                <span className="text-2xl" aria-hidden>
                  🛵
                </span>
                Delivery
              </span>
              <span className="flex flex-col items-center gap-1">
                <span className="text-2xl" aria-hidden>
                  ⏱️
                </span>
                Até 40 min
              </span>
            </div>
            <div className="w-full flex flex-col gap-3 items-center mb-6">
              <button
                type="button"
                onClick={openMenu}
                className="w-full !bg-purple-700 hover:!bg-purple-800 !text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-purple-700/25 active:scale-[0.99] transition"
                style={{ color: "#ffffff", backgroundColor: "#7e22ce" }}
              >
                Pedir agora →
              </button>
              <button
                type="button"
                onClick={openMenu}
                className="w-full border-2 border-black text-black font-bold py-3.5 rounded-2xl text-base text-center bg-transparent hover:bg-black/5 active:scale-[0.99] transition"
              >
                Ver cardápio
              </button>
              <a
                href={GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-gray-200 text-gray-800 font-semibold py-3 rounded-2xl text-sm text-center bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition"
              >
                Entrar no grupo
              </a>
              {canInstall && (
                <button
                  type="button"
                  onClick={() => setShowInstallModal(true)}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 py-2 px-3"
                >
                  <span aria-hidden>+</span> Instalar app
                </button>
              )}
            </div>
            <div className="w-full text-left mb-3">
              <h2 className="text-sm font-extrabold text-black mb-2">Avaliações</h2>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#4285F4]">G</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Google</p>
                  <p className="text-xs text-gray-500">Ver avaliações no Google Maps</p>
                </div>
              </a>
            </div>
            <div className="w-full grid grid-cols-2 gap-3 text-left">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 p-3.5"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">WhatsApp</p>
                  <p className="text-[10px] text-gray-500">Falar agora</p>
                </div>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 p-3.5"
              >
                <span className="text-lg" aria-hidden>
                  📸
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Instagram</p>
                  <p className="text-[10px] text-gray-500">@king.food_delivery</p>
                </div>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setTab("hours")}
              className="w-full mt-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left"
            >
              <span className="text-2xl" aria-hidden>
                🕐
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Horários e entrega</p>
                <p className="text-xs text-gray-500">Em até 40 min • Columbus, OH</p>
              </div>
            </button>
          </div>
        </main>
      )}

      <InstallModal open={showInstallModal} onInstall={handleInstall} onDismiss={dismissInstallModal} />

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-[45] right-4 bottom-24 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 flex items-center justify-center active:scale-95 transition"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>

      <nav className="shrink-0 z-30 bg-white border-t border-gray-100 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-evenly max-w-md mx-auto">
          <button
            type="button"
            onClick={goHome}
            className={`flex flex-col items-center gap-0.5 min-w-[80px] ${
              tab === "home" ? "text-purple-700" : "text-gray-400"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-semibold">Início</span>
          </button>
          <button
            type="button"
            onClick={openMenu}
            className={`flex flex-col items-center gap-0.5 min-w-[80px] ${
              tab === "menu" ? "text-purple-700" : "text-gray-400"
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-semibold">Cardápio</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
