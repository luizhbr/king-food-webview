"use client";

import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "mais", label: "Mais vendidos", emoji: "🔥" },
  { id: "king", label: "Açaí do King", emoji: "👑" },
  { id: "tropical", label: "Tropical", emoji: "🍍" },
  { id: "premium", label: "Premium", emoji: "⭐" },
  { id: "combos", label: "Combos", emoji: "🍨" },
];

const SIDE_LINKS = [
  { label: "Cardápio completo", href: "#menu", action: "menu" },
  { label: "WhatsApp", href: "https://wa.me/12673107535", external: true },
  { label: "Instagram", href: "https://instagram.com/king.food_delivery", external: true },
  { label: "Sobre a King Food", href: "#", action: "home" },
  { label: "Horários e entrega", href: "#", action: "home" },
  { label: "Fale conosco", href: "https://wa.me/12673107535", external: true },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => setLoading(false), 2200);
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

  const openMenu = () => {
    setDrawerOpen(false);
    setShowMenu(true);
  };

  const handleSideLink = (link: (typeof SIDE_LINKS)[0]) => {
    if (link.external && link.href) {
      window.open(link.href, "_blank", "noopener,noreferrer");
      setDrawerOpen(false);
      return;
    }
    if (link.action === "menu") {
      openMenu();
      return;
    }
    setDrawerOpen(false);
    setShowMenu(false);
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
    <div className="min-h-screen bg-white pb-24">
      {/* ========== BARRA PRETA (sempre) ========== */}
      <header className="sticky top-0 z-40 bg-black text-white">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Hamburger */}
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
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Panel */}
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

      {/* ========== CONTEÚDO ========== */}
      {showMenu ? (
        /* Cardápio OlaClick */
        <div className="relative" style={{ height: "calc(100vh - 52px)" }}>
          {!iframeReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-white/95 border-b border-gray-100">
            <button
              onClick={() => {
                setShowMenu(false);
                setIframeReady(false);
              }}
              className="text-sm font-semibold text-purple-700"
            >
              ← Voltar
            </button>
            <span className="text-xs font-medium text-gray-500">Cardápio</span>
            <span className="w-12" />
          </div>
          <iframe
            src="https://kingfood.fe-v2.ola.click/products"
            className="w-full h-full border-0 pt-10"
            title="Cardápio King Food"
            allow="payment"
            onLoad={() => setIframeReady(true)}
          />
        </div>
      ) : (
        /* Home no conceito do cardápio real */
        <main>
          {/* Banner roxo (conceito da imagem) */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 px-4 py-2.5 flex items-center justify-between">
            <p className="text-white text-sm font-semibold">
              Ganhe pontos e recompensas!
            </p>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
              👤
            </span>
          </div>

          {/* Info da loja */}
          <div className="px-4 py-4 flex items-start gap-3 border-b border-gray-100">
            <img
              src="/logo-kingfood.png.png"
              alt="King Food"
              className="w-16 h-16 object-contain rounded-xl bg-[#FFD100] p-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg text-gray-900">King Food</h2>
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  ● Fechado
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                ⏱ Entrega 50 – 60 min
              </p>
              <div className="flex gap-2 mt-2">
                <a
                  href="https://wa.me/12673107535"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm"
                >
                  💬
                </a>
                <a
                  href="https://instagram.com/king.food_delivery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm"
                >
                  📷
                </a>
              </div>
            </div>
            <button
              onClick={openMenu}
              className="text-xs font-semibold text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full whitespace-nowrap"
            >
              Informação
            </button>
          </div>

          {/* Abas de categoria (estilo da imagem) */}
          <div className="sticky top-[52px] z-20 bg-white border-b border-gray-100 overflow-x-auto">
            <div className="flex gap-1 px-3 py-2 min-w-max">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={openMenu}
                  className={`px-3 py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition ${
                    i === 1
                      ? "text-purple-700 border-b-2 border-purple-700"
                      : "text-gray-600"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mais vendidos - cards */}
          <section className="px-4 py-4">
            <h3 className="font-bold text-gray-900 mb-3">Mais vendidos</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {[
                { name: "Açaí | Trufado", price: "16.90" },
                { name: "Açaí King", price: "18.90" },
                { name: "Açaí | Piña", price: "16.50" },
                { name: "Açaí | Ferrero", price: "17.90" },
                { name: "Açaí | Sensação", price: "17.90" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={openMenu}
                  className="min-w-[140px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left active:scale-[0.98] transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-100 via-amber-50 to-[#FFD100]/40 flex items-center justify-center text-4xl relative">
                    🍨
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      +
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      US$ {item.price}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {item.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* CTA principal */}
          <section className="px-4 pb-6">
            <button
              onClick={openMenu}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-purple-700/25 active:scale-[0.99] transition"
            >
              Ver cardápio completo →
            </button>
          </section>
        </main>
      )}

      {/* Bottom nav (só na home) */}
      {!showMenu && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button className="flex flex-col items-center gap-0.5 text-purple-700">
              <span className="text-xl">🏠</span>
              <span className="text-[10px] font-semibold">Início</span>
            </button>
            <button
              onClick={openMenu}
              className="flex flex-col items-center gap-0.5 text-gray-400"
            >
              <span className="text-xl">📋</span>
              <span className="text-[10px] font-semibold">Cardápio</span>
            </button>
            <button
              onClick={openMenu}
              className="-mt-5 w-14 h-14 rounded-full bg-purple-700 text-white shadow-lg shadow-purple-700/30 flex items-center justify-center text-2xl active:scale-95 transition"
            >
              🛒
            </button>
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
      )}
    </div>
  );
}
