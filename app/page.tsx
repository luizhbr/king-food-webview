"use client";

import { useState, useEffect } from "react";

const SIDE_LINKS = [
  { label: "Cardápio completo", action: "close" },
  { label: "WhatsApp", href: "https://wa.me/12673107535", external: true },
  { label: "Instagram", href: "https://instagram.com/king.food_delivery", external: true },
  { label: "Sobre a King Food", action: "close" },
  { label: "Horários e entrega", action: "close" },
  { label: "Fale conosco", href: "https://wa.me/12673107535", external: true },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleSideLink = (link: (typeof SIDE_LINKS)[0]) => {
    if (link.external && link.href) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    }
    setDrawerOpen(false);
  };

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD100]">
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <img
            src="/logo-kingfood.png.png"
            alt="King Food"
            className="w-44 h-44 object-contain drop-shadow-md"
          />
        </div>
        <div
          className={`mt-8 transition-opacity duration-500 delay-300 ${
            showLogo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ========== BARRA PRETA ========== */}
      <header className="shrink-0 z-40 bg-black text-white">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Abrir menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>

            <div className="flex items-center gap-2">
              <img
                src="/logo-kingfood.png.png"
                alt="King Food"
                className="w-9 h-9 object-contain rounded-md"
              />
              <div className="leading-tight">
                <p className="font-bold text-sm">King Food</p>
                <p className="text-[10px] text-white/60">Açaí • Delivery</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/12673107535"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* ========== DRAWER LATERAL ========== */}
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
            <img
              src="/logo-kingfood.png.png"
              alt="King Food"
              className="w-10 h-10 object-contain rounded-md"
            />
            <div>
              <p className="font-bold">King Food</p>
              <p className="text-xs text-white/60">Menu</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <nav className="py-2">
          {SIDE_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleSideLink(link)}
              className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50 transition"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Entrega 50–60 min • Columbus, OH
          </p>
        </div>
      </aside>

      {/* ========== CARDÁPIO DIRETO (iframe) ========== */}
      <div className="flex-1 relative min-h-0">
        {!iframeReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src="https://kingfood.fe-v2.ola.click/products"
          className="absolute inset-0 w-full h-full border-0"
          title="Cardápio King Food"
          allow="payment"
          onLoad={() => setIframeReady(true)}
        />
      </div>

      {/* ========== RODAPÉ ========== */}
      <nav className="shrink-0 z-30 bg-white border-t border-gray-100 px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center gap-0.5 text-purple-700"
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-semibold">Início</span>
          </button>

          <button
            onClick={() => setIframeReady(false)}
            className="flex flex-col items-center gap-0.5 text-gray-400"
            title="Recarregar cardápio"
          >
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-semibold">Cardápio</span>
          </button>

          <a
            href="https://kingfood.fe-v2.ola.click/products"
            target="_blank"
            rel="noopener noreferrer"
            className="-mt-5 w-14 h-14 rounded-full bg-purple-700 text-white shadow-lg shadow-purple-700/30 flex items-center justify-center text-2xl active:scale-95 transition"
            aria-label="Carrinho / Pedir"
          >
            🛒
          </a>

          <a
            href="https://wa.me/12673107535"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-gray-400"
          >
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </a>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 text-gray-400"
          >
            <span className="text-xl">☰</span>
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
