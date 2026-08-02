"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const MENU_URL = "https://kingfood.fe-v2.ola.click/products";
const WA_URL = "https://wa.me/12673107535";
const GROUP_URL = "https://chat.whatsapp.com/LtoVNE9AJ2u2nlrlruTxhd";
const MAPS_URL = "https://maps.app.goo.gl/GR2gpipSMqZdH9Xy5";
const INSTAGRAM_URL = "https://instagram.com/king.food_delivery";
const LOGO = "/logo-kingfood.png.png";
const INSTALL_DISMISS_KEY = "kf_install_dismissed";
const TZ = "America/New_York";

type Tab = "home" | "menu" | "hours";

const SIDE_LINKS: {
  label: string;
  icon: string;
  action?: "hours";
  href?: string;
}[] = [
  { label: "Entrar no grupo", icon: "💬", href: GROUP_URL },
  { label: "Instagram", icon: "📸", href: INSTAGRAM_URL },
  { label: "Horários e entrega", icon: "🕐", action: "hours" },
  { label: "Fale conosco", icon: "📱", href: WA_URL },
];

/** Local hours as displayed — parsed against America/New_York */
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

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

/** Parse "7:00 PM" → minutes from midnight */
function parseClock(token: string): number | null {
  const m = token.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function getColumbusNow(): { day: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = get("weekday");
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  let hour = parseInt(get("hour"), 10);
  if (Number.isNaN(hour)) hour = 0;
  // hour12:false can still yield 24 in some engines
  if (hour === 24) hour = 0;
  const minute = parseInt(get("minute"), 10) || 0;
  return { day: dayMap[wd] ?? new Date().getDay(), minutes: hour * 60 + minute };
}

export type OpenStatus =
  | { open: true; label: string; detail: string }
  | { open: false; label: string; detail: string };

function computeOpenStatus(): OpenStatus {
  const { day, minutes } = getColumbusNow();
  const row = HOURS.find((h) => h.day === day) ?? HOURS[0];
  if (row.hours === "Fechado") {
    // next open day
    for (let i = 1; i <= 7; i++) {
      const nd = (day + i) % 7;
      const nr = HOURS.find((h) => h.day === nd)!;
      if (nr.hours !== "Fechado") {
        const start = nr.hours.split("–")[0]?.trim() ?? "";
        return {
          open: false,
          label: "Fechado",
          detail: i === 1 ? `Abre amanhã ${start}` : `Abre ${nr.label.split("-")[0]} ${start}`,
        };
      }
    }
    return { open: false, label: "Fechado", detail: "Veja horários" };
  }
  const [startTok, endTok] = row.hours.split("–").map((s) => s.trim());
  const start = parseClock(startTok);
  const end = parseClock(endTok);
  if (start == null || end == null) {
    return { open: false, label: "Horários", detail: row.hours };
  }
  if (minutes >= start && minutes < end) {
    return { open: true, label: "Aberto agora", detail: `Fecha ${endTok}` };
  }
  if (minutes < start) {
    return { open: false, label: "Fechado", detail: `Abre ${startTok}` };
  }
  // after close — find next
  for (let i = 1; i <= 7; i++) {
    const nd = (day + i) % 7;
    const nr = HOURS.find((h) => h.day === nd)!;
    if (nr.hours !== "Fechado") {
      const ns = nr.hours.split("–")[0]?.trim() ?? "";
      return {
        open: false,
        label: "Fechado",
        detail: i === 1 ? `Abre amanhã ${ns}` : `Abre ${nr.label} ${ns}`,
      };
    }
  }
  return { open: false, label: "Fechado", detail: "Veja horários" };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Official multicolor Google "G" mark */
function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 shadow-2xl text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD100]">
          <img src={LOGO} alt="" className="h-11 w-11 object-contain" decoding="async" />
        </div>
        <h2 id="install-title" className="text-lg font-extrabold text-white">
          Instale nosso app
        </h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Peça mais rápido direto da tela inicial do seu celular.
        </p>
        <button
          type="button"
          onClick={onInstall}
          className="mt-5 w-full min-h-[48px] rounded-2xl bg-[#FFD100] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#FFD100]/20 active:scale-[0.98] transition"
        >
          Instalar agora
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full min-h-[44px] py-2.5 text-sm font-medium text-white/40 hover:text-white/70 transition"
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
  const [iframeError, setIframeError] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<"android" | "ios" | "desktop">("android");
  const [scrolled, setScrolled] = useState(false);
  const [openStatus, setOpenStatus] = useState<OpenStatus>(() => computeOpenStatus());
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const loadingDone = useRef(false);
  const mainRef = useRef<HTMLElement>(null);
  const ctaPrimaryRef = useRef<HTMLButtonElement>(null);
  const today = useMemo(() => getColumbusNow().day, []);

  // Refresh open/closed every minute
  useEffect(() => {
    setOpenStatus(computeOpenStatus());
    const id = window.setInterval(() => setOpenStatus(computeOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const tryShowInstallSoft = useCallback(() => {
    if (isStandaloneMode()) return;
    const dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1";
    if (dismissed) return;
    if (!deferredPrompt.current && !window.__kfDeferredPrompt) return;
    setCanInstall(true);
    // Soft: only banner, never auto-modal on first paint
  }, []);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => {
      loadingDone.current = true;
      setLoading(false);
    }, 1800);

    // Install prompt delayed — don't interrupt first order intent (12s)
    const bannerTimer = setTimeout(() => {
      if (isStandaloneMode()) return;
      const dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1";
      if (dismissed) return;

      if (deferredPrompt.current || window.__kfDeferredPrompt) {
        setCanInstall(true);
        setShowInstallBanner(true);
        return;
      }

      const ua = navigator.userAgent;
      const isIOS =
        /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
      const isAndroid = /Android/.test(ua);
      setInstallPlatform(isIOS ? "ios" : isAndroid ? "android" : "desktop");
      setShowInstallBanner(true);
    }, 12_000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(safetyTimer);
      clearTimeout(bannerTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || showInstallModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, showInstallModal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (showInstallModal) {
        sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
        setShowInstallModal(false);
        return;
      }
      if (drawerOpen) setDrawerOpen(false);
      if (showInstallBanner) {
        setShowInstallBanner(false);
        sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, showInstallModal, showInstallBanner]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el || tab !== "home") {
      setScrolled(false);
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(el.scrollTop > 80);
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [tab]);

  // Subtle CTA motion — primary only
  useEffect(() => {
    if (tab !== "home") return;
    const btn = ctaPrimaryRef.current;
    if (!btn) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const s = {
      cx: 0,
      cy: 0,
      cs: 1,
      cr: 0,
      tx: 0,
      ty: 0,
      ts: 1,
      tr: 0,
      nextChange: 0,
      hovering: false,
      mx: 0,
      my: 0,
    };

    const onMove = (e: MouseEvent) => {
      s.hovering = true;
      const rect = btn.getBoundingClientRect();
      s.mx = e.clientX - rect.left - rect.width / 2;
      s.my = e.clientY - rect.top - rect.height / 2;
    };
    const onLeave = () => {
      s.hovering = false;
    };
    if (!isTouch) {
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
    }

    let rafId = 0;
    let running = true;
    const animate = (time: number) => {
      if (!running) return;
      if (document.visibilityState === "hidden") {
        rafId = requestAnimationFrame(animate);
        return;
      }
      if (s.hovering && !isTouch) {
        s.tx = s.mx * 0.15;
        s.ty = s.my * 0.2;
        s.ts = 1.05;
        s.tr = s.mx * 0.02;
      } else if (time > s.nextChange) {
        s.tx = (Math.random() - 0.5) * 8;
        s.ty = (Math.random() - 0.5) * 6;
        s.ts = 1 + Math.random() * 0.025;
        s.tr = (Math.random() - 0.5) * 1.5;
        s.nextChange = time + 1600 + Math.random() * 2000;
      }
      s.cx += (s.tx - s.cx) * 0.06;
      s.cy += (s.ty - s.cy) * 0.06;
      s.cs += (s.ts - s.cs) * 0.06;
      s.cr += (s.tr - s.cr) * 0.06;
      btn.style.transform = `translate(${s.cx}px, ${s.cy}px) scale(${s.cs}) rotate(${s.cr}deg)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      btn.style.transform = "";
      if (!isTouch) {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [tab]);

  useEffect(() => {
    if (isStandaloneMode()) {
      setCanInstall(false);
      setShowInstallModal(false);
      setShowInstallBanner(false);
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
      tryShowInstallSoft();
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
      setShowInstallBanner(false);
    };

    window.addEventListener("kf-beforeinstallprompt", onKfBip);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) {
          navigator.serviceWorker.register("/sw.js").catch(() => {});
        } else {
          reg.update().catch(() => {});
        }
      });
    }

    return () => {
      window.removeEventListener("kf-beforeinstallprompt", onKfBip);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [tryShowInstallSoft]);

  // Iframe load timeout → show fallback
  useEffect(() => {
    if (tab !== "menu" || !menuMounted || iframeReady) return;
    setIframeError(false);
    const t = window.setTimeout(() => {
      if (!iframeReady) setIframeError(true);
    }, 12_000);
    return () => window.clearTimeout(t);
  }, [tab, menuMounted, iframeReady]);

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
        setShowInstallBanner(false);
      }
    } catch {
      /* cancelled */
    }
  };

  const dismissInstallModal = () => {
    sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
    setShowInstallModal(false);
    setShowInstallBanner(false);
  };

  const openMenu = () => {
    setDrawerOpen(false);
    if (!menuMounted) {
      setIframeReady(false);
      setIframeError(false);
      setMenuMounted(true);
    }
    setTab("menu");
  };

  const goHome = () => setTab("home");
  const goHours = () => {
    setDrawerOpen(false);
    setTab("hours");
  };

  const headerSubtitle =
    tab === "menu" ? "Cardápio" : tab === "hours" ? "Horários" : "Açaí • Delivery";

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD100]">
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out ${showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          >
            <img
              src={LOGO}
              alt="King Food"
              className="w-44 h-44 object-contain drop-shadow-md"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className={`mt-8 transition-opacity duration-500 delay-300 ${showLogo ? "opacity-100" : "opacity-0"}`}>
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{
        background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 100%), url('/bg-acai.jpg') center/cover no-repeat`,
      }}
    >
      {/* Header */}
      <header
        className={`shrink-0 z-40 text-white border-b transition-all duration-300 ${scrolled || tab !== "home" ? "bg-black/60 backdrop-blur-md border-white/10" : "bg-transparent border-transparent"}`}
      >
        <div className="flex items-center justify-between px-4 py-2 max-w-5xl mx-auto w-full gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-white/10 transition active:scale-90 shrink-0"
              aria-label="Abrir menu"
              aria-expanded={drawerOpen}
            >
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
            <button
              type="button"
              onClick={goHome}
              className={`flex items-center gap-2.5 active:scale-95 transition-all duration-300 min-w-0 ${scrolled || tab !== "home" ? "opacity-100" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"}`}
            >
              <img
                src={LOGO}
                alt="King Food"
                className="w-8 h-8 object-contain rounded-lg shrink-0"
                decoding="async"
              />
              <div className="leading-tight text-left min-w-0">
                <p className="font-bold text-sm tracking-tight truncate">King Food</p>
                <p className="text-[10px] text-white/50 truncate">{headerSubtitle}</p>
              </div>
            </button>
          </div>

          {/* Open/closed badge — always visible on mobile home */}
          <button
            type="button"
            onClick={goHours}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold border transition active:scale-95 ${
              openStatus.open
                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                : "bg-white/10 border-white/15 text-white/70"
            }`}
            aria-label={`${openStatus.label}. ${openStatus.detail}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${openStatus.open ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`}
              aria-hidden
            />
            <span className="hidden xs:inline sm:inline">{openStatus.label}</span>
            <span className="sm:hidden">{openStatus.open ? "Aberto" : "Fechado"}</span>
          </button>

          {/* Inline nav - desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
            <button
              type="button"
              onClick={goHome}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition ${tab === "home" ? "text-[#FFD100]" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            >
              Início
            </button>
            <button
              type="button"
              onClick={openMenu}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition ${tab === "menu" ? "text-[#FFD100]" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            >
              Cardápio
            </button>
            <button
              type="button"
              onClick={goHours}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition ${tab === "hours" ? "text-[#FFD100]" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            >
              Horários
            </button>
            <a
              href={GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition inline-flex items-center"
            >
              Grupo
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition inline-flex items-center"
            >
              Instagram
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold bg-[#25D366] text-white hover:bg-[#25D366]/90 transition inline-flex items-center"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-black border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen ? true : undefined}
      >
        <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="King Food" className="w-10 h-10 object-contain rounded-lg" decoding="async" />
            <div>
              <p className="font-bold text-white">King Food</p>
              <p className="text-xs text-white/40">Menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition active:scale-90"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <nav className="py-2" aria-label="Menu lateral">
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              openMenu();
            }}
            className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-[#FFD100] hover:text-black border-b border-white/5 transition"
          >
            <span className="mr-3">🛒</span>
            Pedir agora
          </button>
          {SIDE_LINKS.map((link) =>
            link.action === "hours" ? (
              <button
                key={link.label}
                type="button"
                onClick={goHours}
                className="w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-[#FFD100] hover:text-black border-b border-white/5 transition active:bg-[#FFD100]/80"
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDrawerOpen(false)}
                className="block w-full text-left px-5 py-4 text-sm font-medium text-white/80 hover:bg-[#FFD100] hover:text-black border-b border-white/5 transition active:bg-[#FFD100]/80"
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </a>
            )
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <p
            className={`text-xs text-center font-semibold ${openStatus.open ? "text-emerald-400" : "text-white/50"}`}
          >
            {openStatus.open ? "● " : "○ "}
            {openStatus.label} · {openStatus.detail}
          </p>
          <p className="text-xs text-white/30 text-center">Entrega em até 40 min • Columbus, OH</p>
        </div>
      </aside>

      {/* Menu tab — keep iframe mounted */}
      <div
        className={`flex-1 relative min-h-0 bg-white max-w-5xl mx-auto w-full md:pb-0 pb-14 ${tab === "menu" ? "" : "hidden"}`}
        aria-hidden={tab !== "menu"}
      >
        {menuMounted && (
          <>
            {(!iframeReady || iframeError) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black px-6">
                {!iframeError ? (
                  <>
                    <div className="w-10 h-10 border-4 border-[#FFD100] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-white/60">Carregando cardápio...</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-white/80 text-center">
                      O cardápio demorou para abrir neste aparelho.
                    </p>
                    <a
                      href={MENU_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[48px] inline-flex items-center justify-center rounded-2xl bg-[#FFD100] px-6 text-sm font-bold text-black"
                    >
                      Abrir cardápio
                    </a>
                  </>
                )}
                <a
                  href={MENU_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#FFD100] underline min-h-[44px] inline-flex items-center"
                >
                  Abrir em nova aba
                </a>
              </div>
            )}
            <iframe
              src={MENU_URL}
              className="absolute inset-0 w-full h-full border-0"
              title="Cardápio King Food"
              allow="payment"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => {
                setIframeReady(true);
                setIframeError(false);
              }}
            />
          </>
        )}
      </div>

      {tab === "hours" ? (
        <main className="flex-1 overflow-y-auto px-4 py-5 max-w-2xl mx-auto w-full md:pb-6 pb-14">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                🕐
              </span>
              <h2 className="text-lg font-extrabold text-white">Horários e entrega</h2>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold border ${
                openStatus.open
                  ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                  : "bg-white/10 border-white/15 text-white/70"
              }`}
            >
              {openStatus.label}
            </span>
          </div>
          <p className="text-sm text-white/50 mb-4">{openStatus.detail} · horário de Columbus, OH</p>
          <ul className="rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
            {HOURS.map((row) => {
              const isToday = row.day === today;
              const closed = row.hours === "Fechado";
              return (
                <li
                  key={row.day}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 min-h-[48px] ${isToday ? "bg-[#FFD100]/10" : "bg-transparent"}`}
                >
                  <span className={`text-sm ${isToday ? "font-bold text-[#FFD100]" : "font-medium text-white/80"}`}>
                    {row.label}
                    {isToday ? " · hoje" : ""}
                  </span>
                  <span
                    className={`text-sm tabular-nums ${isToday ? "font-bold text-[#FFD100]" : closed ? "text-white/30" : "text-white/60"}`}
                  >
                    {row.hours}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white">Entrega</p>
            <p className="text-sm text-white/60 mt-1">Em até 40 min • Columbus, OH</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-[#FFD100]"
            >
              Ver no Google Maps →
            </a>
          </div>
          <button
            type="button"
            onClick={openMenu}
            className="mt-4 w-full min-h-[52px] rounded-2xl bg-[#FFD100] text-black font-bold text-base active:scale-[0.98] transition"
          >
            {openStatus.open ? "Pedir agora" : "Ver cardápio"}
          </button>
        </main>
      ) : tab === "home" ? (
        <main ref={mainRef} className="flex-1 overflow-y-auto md:pb-6 pb-14">
          <div className="max-w-sm md:max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:gap-12 text-center md:text-left px-5 pt-6 pb-4 md:pt-16">
            <div className="flex flex-col items-center md:items-start flex-1 w-full">
              <img
                src={LOGO}
                alt="King Food"
                className="w-20 h-20 md:w-32 md:h-32 object-contain mb-3 rounded-2xl"
                decoding="async"
                fetchPriority="high"
              />

              <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">King Food</h1>
              <p className="text-sm md:text-base text-white/50 mb-2">Açaí Premium • Columbus, OH</p>

              <p
                className={`text-xs font-semibold mb-3 ${openStatus.open ? "text-emerald-400" : "text-white/50"}`}
              >
                {openStatus.open ? "● " : "○ "}
                {openStatus.label}
                {openStatus.detail ? ` · ${openStatus.detail}` : ""}
              </p>

              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-5 max-w-md">
                Açaí brasileiro feito com ingredientes premium. Delivery em Columbus.
              </p>

              {/* Primary CTA only */}
              <button
                type="button"
                onClick={openMenu}
                ref={ctaPrimaryRef}
                className="w-full md:w-auto md:min-w-[240px] min-h-[52px] bg-[#FFD100] hover:bg-[#FFD100]/90 text-black font-bold py-3.5 rounded-2xl text-base shadow-lg shadow-[#FFD100]/20 active:scale-[0.98] transition will-change-transform"
              >
                {openStatus.open ? "Pedir agora →" : "Ver cardápio →"}
              </button>

              {/* Secondary — text link, not competing button */}
              <a
                href={GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 min-h-[44px] inline-flex items-center text-sm font-semibold text-white/55 hover:text-white/85 underline-offset-4 hover:underline transition"
              >
                Entrar no grupo do WhatsApp
              </a>

              {canInstall && (
                <button
                  type="button"
                  onClick={() => setShowInstallModal(true)}
                  className="mt-2 min-h-[44px] text-sm font-medium text-white/40 hover:text-white/70 py-1.5 transition"
                >
                  + Instalar app
                </button>
              )}
            </div>

            {/* Desktop info cards */}
            <div className="hidden md:flex flex-col gap-4 flex-1 mt-0">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 active:scale-[0.98] transition min-h-[72px]"
              >
                <div className="shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <GoogleGIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Google Business</p>
                  <p className="text-sm text-[#FFD100]">Ver avaliações reais →</p>
                  <p className="text-xs text-white/40">Maps · Columbus, OH</p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 active:scale-[0.97] transition min-h-[64px]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">WhatsApp</p>
                    <p className="text-[10px] text-white/40">Falar agora</p>
                  </div>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 active:scale-[0.97] transition min-h-[64px]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2">
                    <defs>
                      <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="50%" stopColor="#e6683c" />
                        <stop offset="100%" stopColor="#dc2743" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad)" stroke="none" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-white">Instagram</p>
                    <p className="text-[10px] text-white/40">@king.food_delivery</p>
                  </div>
                </a>
              </div>

              <button
                type="button"
                onClick={goHours}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 active:scale-[0.98] transition text-left min-h-[72px]"
              >
                <span className="text-2xl" aria-hidden>
                  🕐
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Horários e entrega</p>
                  <p className="text-xs text-white/40">
                    {openStatus.label} · em até 40 min · Columbus, OH
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            <div className="w-full mt-5 text-left px-5">
              <h2 className="text-sm font-extrabold text-white mb-2.5">Avaliações</h2>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 active:scale-[0.98] transition min-h-[64px]"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <GoogleGIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Google Business</p>
                  <p className="text-sm text-[#FFD100]">Ver avaliações reais →</p>
                  <p className="text-xs text-white/40">Maps · Columbus, OH</p>
                </div>
              </a>
            </div>

            <div className="w-full mt-4 text-left px-5 pb-4">
              <h2 className="text-sm font-extrabold text-white mb-2.5">Contato</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 active:scale-[0.97] transition min-h-[64px]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">WhatsApp</p>
                    <p className="text-[10px] text-white/40">Falar agora</p>
                  </div>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 active:scale-[0.97] transition min-h-[64px]"
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#ig-grad-m)"
                    strokeWidth="2"
                  >
                    <defs>
                      <linearGradient id="ig-grad-m" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="50%" stopColor="#e6683c" />
                        <stop offset="100%" stopColor="#dc2743" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad-m)" stroke="none" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-white">Instagram</p>
                    <p className="text-[10px] text-white/40">@king.food_delivery</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
      ) : null}

      <InstallModal open={showInstallModal} onInstall={handleInstall} onDismiss={dismissInstallModal} />

      {/* Soft install banner — delayed, bottom, not blocking CTA */}
      {showInstallBanner && !showInstallModal && tab === "home" && (
        <div className="fixed bottom-14 md:bottom-4 left-0 right-0 z-[90] px-4 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-sm rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-3 shadow-2xl flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center">
              <img src={LOGO} alt="" className="w-7 h-7 object-contain" decoding="async" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Instale o King Food</p>
              <p className="text-xs text-white/50 leading-snug">
                {installPlatform === "ios"
                  ? "Compartilhar → Tela de Início"
                  : "Acesso rápido na tela inicial"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (deferredPrompt.current || window.__kfDeferredPrompt) {
                  handleInstall();
                } else {
                  setShowInstallModal(true);
                }
              }}
              className="shrink-0 min-h-[40px] rounded-xl bg-[#FFD100] px-3 py-2 text-xs font-bold text-black active:scale-95 transition"
            >
              {installPlatform === "ios" ? "Ver" : "Instalar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInstallBanner(false);
                sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
              }}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav — 3 tabs, no FAB overlay */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
        aria-label="Navegação inferior"
      >
        <div className="flex items-center justify-evenly max-w-md mx-auto">
          <button
            type="button"
            onClick={goHome}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[88px] min-h-[52px] py-1 rounded-lg transition active:scale-90 ${tab === "home" ? "text-[#FFD100]" : "text-white/40"}`}
            aria-current={tab === "home" ? "page" : undefined}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l9-9 9 9" />
              <path d="M5 10v10h14V10" />
            </svg>
            <span className="text-[10px] font-semibold">Início</span>
          </button>
          <button
            type="button"
            onClick={openMenu}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[88px] min-h-[52px] py-1 rounded-lg transition active:scale-90 ${tab === "menu" ? "text-[#FFD100]" : "text-white/40"}`}
            aria-current={tab === "menu" ? "page" : undefined}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="13" y2="16" />
            </svg>
            <span className="text-[10px] font-semibold">Cardápio</span>
          </button>
          <button
            type="button"
            onClick={goHours}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[88px] min-h-[52px] py-1 rounded-lg transition active:scale-90 ${tab === "hours" ? "text-[#FFD100]" : "text-white/40"}`}
            aria-current={tab === "hours" ? "page" : undefined}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            <span className="text-[10px] font-semibold">Horários</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
