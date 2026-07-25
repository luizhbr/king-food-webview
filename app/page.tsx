"use client";

import { useState, useEffect } from "react";

const MENU_URL = "https://kingfood.fe-v2.ola.click/products";

const SIDE_LINKS = [
  { label: "Cardápio completo", href: MENU_URL, external: true },
  { label: "WhatsApp", href: "https://wa.me/12673107535", external: true },
  { label: "Instagram", href: "https://instagram.com/king.food_delivery", external: true },
  { label: "Sobre a King Food", href: MENU_URL, external: true },
  { label: "Horários e entrega", href: MENU_URL, external: true },
  { label: "Fale conosco", href: "https://wa.me/12673107535", external: true },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => setLoading(false), 1800);
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
    window.location.href = MENU_URL;
  };

  const handleSideLink = (link: (typeof SIDE_LINKS)[0]) => {
    setDrawerOpen(false);
    if (link.external && link.href) {
      if (link.href.includes("ola.click")) {
        window.location.href = link.href;
      } else {
        window.open(link.href, "_blank", "noopener,noreferrer");
      }
    }
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

            <button onClick={openMenu} className="flex items-center gap-2">
              <img
                src="/logo-kingfood.png.png"
                alt="King Food"
                className="w-9 h-9 object-contain rounded-md"
              />
              <div className="leading-tight text-left">
                <p className="font-bold text-sm">King Food</p>
                <p className="text-[10px] text-white/60">Açaí • Delivery</p>
              </div>
            </button>
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

      {/* ========== DRAWER ========== */}
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

      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 bg-white min-h-0">
        <img
          src="/logo-kingfood.png.png"
          alt="King Food"
          className="w-28 h-28 object-contain mb-4"
        />
        <h1 className="text-xl font-bold text-gray-900 mb-1">King Food</h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Açaí • Delivery • Columbus, OH
        </p>

        <button
          onClick={openMenu}
          className="w-full max-w-sm bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-purple-700/25 active:scale-[0.99] transition"
        >
          Ver cardápio →
        </button>

        <a
          href="https://wa.me/12673107535"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm font-semibold text-green-600"
        >
          Ou peça pelo WhatsApp
        </a>
      </main>

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
            onClick={openMenu}
            className="flex flex-col items-center gap-0.5 text-gray-400"
          >
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-semibold">Cardápio</span>
          </button>

          <button
            onClick={openMenu}
            className="-mt-5 w-14 h-14 rounded-full bg-purple-700 text-white shadow-lg shadow-purple-700/30 flex items-center justify-center text-2xl active:scale-95 transition"
            aria-label="Pedir"
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
    </div>
  );
}
