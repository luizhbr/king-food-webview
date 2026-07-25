"use client";

import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "mais", label: "Mais vendidos", emoji: "🔥" },
  { id: "king", label: "Açaí King", emoji: "👑" },
  { id: "tropical", label: "Tropical", emoji: "🍍" },
  { id: "premium", label: "Premium", emoji: "⭐" },
  { id: "combos", label: "Combos", emoji: "🥤" },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const safetyTimer = setTimeout(() => setLoading(false), 2500);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const openMenu = () => {
    setShowMenu(true);
  };

  const handleIframeLoad = () => {
    setIframeReady(true);
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
        <p
          className={`text-black/70 text-xs mt-5 font-medium transition-opacity duration-500 delay-500 ${
            showLogo ? "opacity-100" : "opacity-0"
          }`}
        >
          Carregando...
        </p>
      </div>
    );
  }

  // ========== FULL MENU (iframe) ==========
  if (showMenu) {
    return (
      <div className="relative flex flex-col h-screen bg-[#F7F7F5] overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-20">
          <button
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <span className="text-lg">←</span>
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/logo-kingfood.png.png"
              alt="King Food"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-sm">Cardápio</span>
          </div>
          <a
            href="https://wa.me/12673107535"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 text-sm font-semibold"
          >
            WhatsApp
          </a>
        </header>

        <div className="flex-1 relative bg-white">
          {!iframeReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="w-10 h-10 border-4 border-[#FFD100] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src="https://kingfood.fe-v2.ola.click/products"
            className="absolute inset-0 w-full h-full border-0"
            title="Cardápio King Food"
            allow="payment"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    );
  }

  // ========== HOME (UX estilo delivery premium) ==========
  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/logo-kingfood.png.png"
              alt="King Food"
              className="w-11 h-11 object-contain"
            />
            <div>
              <h1 className="font-extrabold text-base leading-tight text-black tracking-tight">
                KING FOOD
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">Açaí & Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/12673107535"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-lg"
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>
        </div>

        {/* Barra de entrega */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2.5 border border-gray-100">
            <span className="text-red-500 text-sm">📍</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                Entregar em
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                Columbus, OH • 50–60 min
              </p>
            </div>
            <button
              onClick={openMenu}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600"
              aria-label="Buscar"
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-5">
        {/* Hero banner */}
        <section
          onClick={openMenu}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black text-white p-5 cursor-pointer active:scale-[0.99] transition"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#FFD100]/20 blur-2xl" />
          <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full bg-red-500/20 blur-2xl" />

          <p className="text-[#FFD100] text-xs font-bold tracking-widest uppercase mb-2">
            King Food Delivery
          </p>
          <h2 className="text-2xl font-extrabold leading-tight mb-1">
            Açaí premium.
            <br />
            Entrega rápida.
          </h2>
          <p className="text-white/70 text-sm mb-4 max-w-[70%]">
            Monte o seu, escolha os toppings e peça agora.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#FFD100] text-black font-bold text-sm px-4 py-2.5 rounded-full">
            Pedir agora
            <span>→</span>
          </button>
        </section>

        {/* Categorias */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={openMenu}
                className="flex flex-col items-center gap-1.5 min-w-[72px] active:scale-95 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl">
                  {cat.emoji}
                </div>
                <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Destaques */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-base">Mais pedidos</h3>
            <button
              onClick={openMenu}
              className="text-sm font-semibold text-red-600"
            >
              Ver tudo →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Açaí do King", tag: "👑 Signature" },
              { name: "Açaí Tropical", tag: "🍍 Frutas" },
              { name: "Açaí Premium", tag: "⭐ Top" },
              { name: "Combos", tag: "🔥 Oferta" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={openMenu}
                className="bg-white rounded-2xl border border-gray-100 p-3 text-left shadow-sm active:scale-[0.98] transition"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFD100]/40 to-amber-100 mb-3 flex items-center justify-center text-3xl">
                  🍨
                </div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-0.5">
                  {item.tag}
                </p>
                <p className="font-bold text-sm text-gray-900 leading-snug">
                  {item.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Ver opções</span>
                  <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Banner fidelidade / CTA */}
        <section
          onClick={openMenu}
          className="rounded-2xl bg-white border border-gray-100 p-4 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FFD100] flex items-center justify-center text-2xl shrink-0">
            👑
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">Peça no app King Food</p>
            <p className="text-xs text-gray-500 leading-snug">
              Cardápio completo com montagem e checkout seguro
            </p>
          </div>
          <button className="bg-black text-white text-xs font-bold px-3 py-2 rounded-full whitespace-nowrap">
            Abrir
          </button>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button className="flex flex-col items-center gap-0.5 text-red-600">
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

          {/* Carrinho central em destaque */}
          <button
            onClick={openMenu}
            className="-mt-5 w-14 h-14 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 flex items-center justify-center text-2xl active:scale-95 transition"
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
            onClick={openMenu}
            className="flex flex-col items-center gap-0.5 text-gray-400"
          >
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-semibold">Conta</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
