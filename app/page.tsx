"use client";

import { useState, useEffect, useRef } from "react";

const MENU_URL = "https://kingfood.fe-v2.ola.click/products";
const WA_URL = "https://wa.me/12673107535";
const GROUP_URL =
  "https://wa.me/12673107535?text=Ol%C3%A1!%20Quero%20entrar%20no%20grupo%20da%20King%20Food";
const MAPS_URL = "https://maps.app.goo.gl/GR2gpipSMqZdH9Xy5";
const LOGO = "/logo-kingfood.png.png";
const INSTALL_DISMISS_KEY = "kf_install_dismissed";

type Tab =
  | "home"
  | "menu"
  | "orders"
  | "rewards"
  | "profile"
  | "addresses"
  | "rate";

type SideAction = "profile" | "addresses" | "rate" | "hours";

const SIDE_LINKS: {
  label: string;
  action?: SideAction;
  href?: string;
}[] = [
  { label: "Meus dados", action: "profile" },
  { label: "Meus endereços", action: "addresses" },
  { label: "Avaliar pedido", action: "rate" },
  { label: "Entrar no grupo", href: GROUP_URL },
  { label: "Instagram", href: "https://instagram.com/king.food_delivery" },
  { label: "Horários e entrega", action: "hours" },
  { label: "Fale conosco", href: WA_URL },
];

const HOME_REVIEWS = [
  { t: "Melhor açaí de Columbus.", a: "Marina S." },
  { t: "Sabor igual ao do Brasil.", a: "Carlos R." },
  { t: "Entrega rápida e carinhosa.", a: "Juliana P." },
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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [iframeReady, setIframeReady] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const pointsBalance = 0;

  const [addresses, setAddresses] = useState<{ id: string; label: string; line: string }[]>([]);
  const [newAddress, setNewAddress] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingSent, setRatingSent] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => setLoading(false), 1800);
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
    try {
      const saved = localStorage.getItem("kf_profile");
      if (saved) {
        const p = JSON.parse(saved);
        setProfileName(p.name || "");
        setProfilePhone(p.phone || "");
        setProfileEmail(p.email || "");
      }
      const addr = localStorage.getItem("kf_addresses");
      if (addr) setAddresses(JSON.parse(addr));
    } catch {
      /* ignore */
    }
  }, []);

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

    const dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1";

    const adoptPrompt = (evt: BeforeInstallPromptEvent | null | undefined) => {
      if (!evt) return;
      deferredPrompt.current = evt;
      setCanInstall(true);
      if (!dismissed) setShowInstallModal(true);
      console.log("[King Food PWA] prompt adotado pelo React");
    };

    // Prompt capturado pelo script early no <head>
    adoptPrompt(window.__kfDeferredPrompt ?? null);

    const onKfBip = () => {
      adoptPrompt(window.__kfDeferredPrompt ?? null);
    };

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const bip = e as BeforeInstallPromptEvent;
      window.__kfDeferredPrompt = bip;
      adoptPrompt(bip);
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

    // Re-registrar SW se ainda não estiver (fallback)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    return () => {
      window.removeEventListener("kf-beforeinstallprompt", onKfBip);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const promptEvent =
      deferredPrompt.current || (window.__kfDeferredPrompt as BeforeInstallPromptEvent | null);
    if (!promptEvent) {
      console.warn("[King Food PWA] nenhum deferred prompt disponível");
      return;
    }
    setShowInstallModal(false);
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log("[King Food PWA] userChoice", outcome);
    if (outcome === "accepted") {
      deferredPrompt.current = null;
      window.__kfDeferredPrompt = null;
      setCanInstall(false);
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

  const openOrders = () => {
    setDrawerOpen(false);
    setTab("orders");
  };

  const openRewards = () => {
    setDrawerOpen(false);
    setTab("rewards");
  };

  const saveProfile = () => {
    localStorage.setItem(
      "kf_profile",
      JSON.stringify({ name: profileName, phone: profilePhone, email: profileEmail })
    );
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const addAddress = () => {
    const line = newAddress.trim();
    if (!line) return;
    const next = [...addresses, { id: String(Date.now()), label: "Endereço", line }];
    setAddresses(next);
    localStorage.setItem("kf_addresses", JSON.stringify(next));
    setNewAddress("");
  };

  const removeAddress = (id: string) => {
    const next = addresses.filter((a) => a.id !== id);
    setAddresses(next);
    localStorage.setItem("kf_addresses", JSON.stringify(next));
  };

  const submitRating = () => {
    if (rating < 1) return;
    setRatingSent(true);
  };

  const handleSideLink = (link: (typeof SIDE_LINKS)[0]) => {
    setDrawerOpen(false);
    if (link.action === "profile") {
      setTab("profile");
      return;
    }
    if (link.action === "addresses") {
      setTab("addresses");
      return;
    }
    if (link.action === "rate") {
      setRating(0);
      setComment("");
      setRatingSent(false);
      setTab("rate");
      return;
    }
    if (link.action === "hours") {
      window.open(MAPS_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (link.href) window.open(link.href, "_blank", "noopener,noreferrer");
  };

  const headerSubtitle =
    tab === "menu"
      ? "Cardápio"
      : tab === "orders"
        ? "Pedidos"
        : tab === "rewards"
          ? "Recompensas"
          : tab === "profile"
            ? "Meus dados"
            : tab === "addresses"
              ? "Endereços"
              : tab === "rate"
                ? "Avaliar"
                : "Açaí • Delivery";

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD100]">
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <img src={LOGO} alt="King Food" className="w-44 h-44 object-contain drop-shadow-md" />
        </div>
        <div className={`mt-8 transition-opacity duration-500 delay-300 ${showLogo ? "opacity-100" : "opacity-0"}`}>
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <header className="shrink-0 z-40 bg-black text-white">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDrawerOpen(true)} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition" aria-label="Abrir menu">
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
            <button type="button" onClick={goHome} className="text-xs font-semibold text-white/80 px-2 py-1.5 rounded-lg hover:bg-white/10">← Início</button>
          )}
        </div>
      </header>

      <div className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setDrawerOpen(false)} />

      <aside className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-black text-white px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="King Food" className="w-10 h-10 object-contain rounded-md" />
            <div>
              <p className="font-bold">King Food</p>
              <p className="text-xs text-white/60">Menu</p>
            </div>
          </div>
          <button type="button" onClick={() => setDrawerOpen(false)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg" aria-label="Fechar">✕</button>
        </div>
        <nav className="py-2">
          {SIDE_LINKS.map((link) => (
            <button key={link.label} type="button" onClick={() => handleSideLink(link)} className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50 transition">{link.label}</button>
          ))}
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
              <a href={MENU_URL} className="text-sm font-semibold text-purple-700 underline">Abrir em nova aba</a>
            </div>
          )}
          <iframe src={MENU_URL} className="absolute inset-0 w-full h-full border-0" title="Cardápio King Food" allow="payment" onLoad={() => setIframeReady(true)} />
        </div>
      ) : tab === "orders" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <h2 className="text-lg font-extrabold text-black mb-4">Pedidos</h2>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Em andamento</p>
            <p className="text-sm font-semibold text-gray-800">Nenhum pedido em andamento</p>
          </div>
          <button type="button" onClick={openMenu} className="inline-flex bg-purple-700 text-white text-sm font-bold px-4 py-2.5 rounded-full">Ver cardápio</button>
        </main>
      ) : tab === "rewards" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <h2 className="text-lg font-extrabold text-black mb-4">Recompensas</h2>
          <div className="rounded-2xl bg-gradient-to-r from-purple-700 to-purple-500 text-white p-5 mb-5">
            <p className="text-3xl font-extrabold">{pointsBalance} pts</p>
          </div>
          <button type="button" onClick={openMenu} className="w-full bg-purple-700 text-white font-bold py-3.5 rounded-2xl text-sm">Pedir e ganhar pontos →</button>
        </main>
      ) : tab === "profile" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <h2 className="text-lg font-extrabold text-black mb-4">Meus dados</h2>
          <div className="space-y-3">
            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Nome" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="Telefone" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
          </div>
          <button type="button" onClick={saveProfile} className="mt-6 w-full bg-black text-white font-bold py-3.5 rounded-2xl text-sm">{profileSaved ? "Salvo ✓" : "Salvar dados"}</button>
        </main>
      ) : tab === "addresses" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <h2 className="text-lg font-extrabold text-black mb-4">Meus endereços</h2>
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-gray-100 p-4 mb-2 flex justify-between gap-3">
              <p className="text-sm">{a.line}</p>
              <button type="button" onClick={() => removeAddress(a.id)} className="text-xs text-red-600">Remover</button>
            </div>
          ))}
          <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Novo endereço" rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm resize-none" />
          <button type="button" onClick={addAddress} className="mt-3 w-full bg-black text-white font-bold py-3.5 rounded-2xl text-sm">Salvar endereço</button>
        </main>
      ) : tab === "rate" ? (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <h2 className="text-lg font-extrabold text-black mb-2">Avaliar pedido</h2>
          {ratingSent ? (
            <p className="text-sm font-bold">Obrigado!</p>
          ) : (
            <>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} className={`w-11 h-11 text-xl ${n <= rating ? "text-[#FFD100]" : "text-gray-300"}`}>★</button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentário" rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm resize-none" />
              <button type="button" onClick={submitRating} disabled={rating < 1} className="mt-4 w-full bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-2xl text-sm">Enviar</button>
            </>
          )}
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto bg-white px-4 py-6">
          <div className="max-w-sm mx-auto flex flex-col items-center text-center">
            <img src={LOGO} alt="King Food" className="w-24 h-24 object-contain mb-3" />
            <p className="text-2xl mb-1" aria-hidden>😍 🍇</p>
            <h1 className="text-xl font-extrabold text-gray-900 mb-2">Bem-vindo(a) ao King Food</h1>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              O sabor BR que dá um tapa na saudade. Açaí tradicional brasileiro, feito com ingredientes premium, entregue com carinho em Columbus.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Welcome to King Food! Authentic Brazilian açaí, delivered with love in Columbus.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-gray-600">
              <span className="flex flex-col items-center gap-1"><span className="text-2xl" aria-hidden>🧳</span>Retirada</span>
              <span className="flex flex-col items-center gap-1"><span className="text-2xl" aria-hidden>🛵</span>Delivery</span>
            </div>
            <div className="w-full flex flex-col gap-3 items-center mb-6">
              <button type="button" onClick={openMenu} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-purple-700/25 active:scale-[0.99] transition">Ver cardápio →</button>
              <a href={GROUP_URL} target="_blank" rel="noopener noreferrer" className="w-full border-2 border-black text-black font-bold py-3.5 rounded-2xl text-base text-center bg-transparent hover:bg-black/5 active:scale-[0.99] transition">Entre em nosso grupo</a>
              {canInstall && (
                <button type="button" onClick={handleInstall} className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 py-2 px-3">
                  <span aria-hidden>+</span> Instalar app
                </button>
              )}
            </div>
            <div className="w-full text-left mb-3">
              <h2 className="text-sm font-extrabold text-black mb-2">O que dizem nossos clientes</h2>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center"><span className="text-lg font-bold text-[#4285F4]">G</span></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Google</p>
                  <p className="text-sm text-[#E37400]">★★★★★ 5.0</p>
                  <p className="text-xs text-gray-500">Ver todas as avaliações no Google Maps</p>
                </div>
              </a>
            </div>
            <div className="w-full flex gap-3 overflow-x-auto pb-2 scrollbar-hide text-left">
              {HOME_REVIEWS.map((r) => (
                <div key={r.a} className="min-w-[200px] rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[#FFD100] text-xs">★★★★★</p>
                  <p className="text-xs text-gray-800 mt-1">“{r.t}”</p>
                  <p className="text-[10px] text-gray-400 mt-2">{r.a}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {showInstallModal && canInstall && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/55" onClick={dismissInstallModal} aria-hidden />
          <div role="dialog" aria-modal="true" aria-labelledby="install-title" className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD100]">
              <img src={LOGO} alt="" className="h-12 w-12 object-contain" />
            </div>
            <h2 id="install-title" className="text-lg font-extrabold text-gray-900">Instale nosso app 📲</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Peça mais rápido, acompanhe seus pedidos e acumule pontos direto na tela inicial do seu celular.
            </p>
            <button type="button" onClick={handleInstall} className="mt-5 w-full rounded-2xl bg-purple-700 py-3.5 text-sm font-bold text-white">Instalar agora</button>
            <button type="button" onClick={dismissInstallModal} className="mt-2 w-full py-2.5 text-sm font-medium text-gray-500">Agora não</button>
          </div>
        </div>
      )}

      <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="fixed z-[45] right-4 bottom-24 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 flex items-center justify-center active:scale-95 transition" aria-label="WhatsApp">
        <WhatsAppIcon className="w-7 h-7" />
      </a>

      <nav className="shrink-0 z-30 bg-white border-t border-gray-100 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button type="button" onClick={goHome} className={`flex flex-col items-center gap-0.5 min-w-[56px] ${tab === "home" ? "text-purple-700" : "text-gray-400"}`}><span className="text-xl">🏠</span><span className="text-[10px] font-semibold">Início</span></button>
          <button type="button" onClick={openMenu} className={`flex flex-col items-center gap-0.5 min-w-[56px] ${tab === "menu" ? "text-purple-700" : "text-gray-400"}`}><span className="text-xl">📋</span><span className="text-[10px] font-semibold">Cardápio</span></button>
          <button type="button" onClick={openMenu} className="-mt-5 w-14 h-14 rounded-full bg-purple-700 text-white shadow-lg flex items-center justify-center text-2xl" aria-label="Pedir">🛒</button>
          <button type="button" onClick={openOrders} className={`flex flex-col items-center gap-0.5 min-w-[56px] ${tab === "orders" ? "text-purple-700" : "text-gray-400"}`}><span className="text-xl">🧾</span><span className="text-[10px] font-semibold">Pedidos</span></button>
          <button type="button" onClick={openRewards} className={`flex flex-col items-center gap-0.5 min-w-[56px] ${tab === "rewards" ? "text-purple-700" : "text-gray-400"}`}><span className="text-xl">⭐</span><span className="text-[10px] font-semibold">Recompensas</span></button>
        </div>
      </nav>
    </div>
  );
}
