"use client";

import { useState, useEffect } from "react";

const MENU_URL = "https://kingfood.fe-v2.ola.click/products";
const WA_URL = "https://wa.me/12673107535";
const LOGO = "/logo-kingfood.png.png";

const BEST_SELLERS = [
  { name: "Açaí King", price: "18.90", badge: "Mais vendido", emoji: "👑" },
  { name: "Açaí Trufado", price: "16.90", badge: "Promoção", emoji: "🍫" },
  { name: "Açaí Ferrero", price: "17.90", badge: "Novo", emoji: "🌰" },
  { name: "Açaí Piña", price: "16.50", badge: "", emoji: "🍍" },
  { name: "Açaí Sensação", price: "17.90", badge: "", emoji: "🍓" },
];

const COMBOS = [
  { name: "Combo King", price: "24.90", desc: "Açaí 500ml + top 3 + bebida", emoji: "👑" },
  { name: "Combo Tropical", price: "22.90", desc: "Açaí + frutas + granola", emoji: "🍍" },
  { name: "Combo Premium", price: "27.90", desc: "Açaí 700ml + extras premium", emoji: "⭐" },
];

const REVIEWS = [
  { text: "Melhor açaí de Columbus.", author: "Marina S." },
  { text: "Entrega muito rápida.", author: "Carlos R." },
  { text: "Finalmente um sabor igual ao do Brasil.", author: "Juliana P." },
];

const WHY = [
  { icon: "🇧🇷", title: "Sabor Brasileiro", desc: "Receita autêntica, como no Brasil" },
  { icon: "🚗", title: "Entrega rápida", desc: "Chega quentinho em 25–35 min" },
  { icon: "🥣", title: "Ingredientes Premium", desc: "Frutas e bases selecionadas" },
  { icon: "❤️", title: "Atendimento excelente", desc: "Pedido certo, sempre" },
];

const SIDE_LINKS = [
  { label: "Cardápio completo", href: MENU_URL },
  { label: "WhatsApp", href: WA_URL },
  { label: "Instagram", href: "https://instagram.com/king.food_delivery" },
  { label: "Horários e entrega", href: MENU_URL },
  { label: "Fale conosco", href: WA_URL },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(true), 80);
    const t2 = setTimeout(() => setLoading(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (loading) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % 3);
    }, 4000);
    return () => clearInterval(id);
  }, [loading]);

  const openMenu = () => {
    window.location.href = MENU_URL;
  };

  const openLink = (href: string) => {
    setDrawerOpen(false);
    if (href.includes("ola.click")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFD100]">
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <img src={LOGO} alt="King Food" className="w-40 h-40 object-contain drop-shadow-md" />
        </div>
        <div
          className={`mt-8 transition-opacity duration-500 delay-200 ${
            showLogo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-9 h-9 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const heroSlides = [
    { emoji: "🍨", label: "Açaí Premium" },
    { emoji: "🍓", label: "Frutas frescas" },
    { emoji: "👑", label: "Sabor King" },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black text-white shadow-sm">
        <div className="flex items-center justify-between px-3 py-2.5 max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-white/10 transition shrink-0"
              aria-label="Abrir menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 min-w-0">
              <img src={LOGO} alt="King Food" className="w-9 h-9 object-contain rounded-lg shrink-0" />
              <div className="leading-tight text-left truncate">
                <p className="font-bold text-sm tracking-tight">King Food</p>
                <p className="text-[10px] text-white/55">Açaí • Delivery</p>
              </div>
            </button>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3.5 py-2 rounded-full transition min-h-[44px] flex items-center"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* DRAWER */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[82%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu lateral"
      >
        <div className="bg-black text-white px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" className="w-10 h-10 object-contain rounded-lg" />
            <div>
              <p className="font-bold">King Food</p>
              <p className="text-xs text-white/60">Menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-lg"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>
        <nav className="py-1">
          {SIDE_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => openLink(link.href)}
              className="w-full text-left px-5 py-4 text-sm font-medium text-gray-900 hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50 transition min-h-[48px]"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Columbus, OH • 25–35 min</p>
        </div>
      </aside>

      <main>
        {/* HERO */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 pt-6 pb-8">
            {/* Carousel visual */}
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden mb-5 bg-gradient-to-br from-purple-800 via-purple-600 to-[#FFD100]">
              {heroSlides.map((slide, i) => (
                <div
                  key={slide.label}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
                    i === heroIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-6xl sm:text-7xl drop-shadow-lg" aria-hidden>
                    {slide.emoji}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white/90">{slide.label}</p>
                </div>
              ))}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroIndex ? "w-6 bg-[#FFD100]" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80 mb-4">
              <span className="text-[#FFD100] tracking-tight">★★★★★ 4.9</span>
              <span className="text-white/30">·</span>
              <span>+2.000 pedidos</span>
              <span className="text-white/30">·</span>
              <span>25–35 min</span>
              <span className="text-white/30">·</span>
              <span>Columbus, OH 🇧🇷</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight mb-2">
              O verdadeiro sabor do Brasil em Columbus
            </h1>
            <p className="text-white/70 text-sm sm:text-base mb-6">
              Açaís Premium, Combos e Delivery Rápido.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={openMenu}
                className="flex-1 min-h-[52px] bg-[#FFD100] hover:bg-[#f0c400] text-black font-extrabold text-base rounded-2xl px-6 py-3.5 active:scale-[0.98] transition shadow-lg shadow-[#FFD100]/20"
              >
                🍓 Pedir agora
              </button>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[52px] bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-2xl px-6 py-3.5 flex items-center justify-center active:scale-[0.98] transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* PROMO */}
        <section className="px-4 -mt-1 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={openMenu}
            className="w-full text-left rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white p-4 shadow-md active:scale-[0.99] transition"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/90 mb-1">
              🔥 Promoção do dia
            </p>
            <p className="text-xl font-extrabold leading-none">10% OFF</p>
            <p className="text-sm mt-1 text-white/90">Todos os Combos · Até às 23:59</p>
          </button>
        </section>

        {/* WHY */}
        <section className="px-4 py-8 max-w-3xl mx-auto">
          <h2 className="text-lg font-extrabold text-black mb-4">Por que escolher a King Food</h2>
          <div className="grid grid-cols-2 gap-3">
            {WHY.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <p className="font-bold text-sm mt-2 text-black">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MAIS PEDIDOS */}
        <section className="py-2 max-w-3xl mx-auto">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-extrabold text-black">Mais pedidos</h2>
            <button type="button" onClick={openMenu} className="text-sm font-bold text-purple-700 min-h-[44px]">
              Ver tudo →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {BEST_SELLERS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={openMenu}
                className="min-w-[148px] max-w-[148px] text-left rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden active:scale-[0.98] transition"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-100 via-amber-50 to-[#FFD100]/50 flex items-center justify-center relative">
                  <span className="text-4xl" aria-hidden>
                    {item.emoji}
                  </span>
                  {item.badge ? (
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === "Promoção"
                          ? "bg-red-600 text-white"
                          : item.badge === "Novo"
                            ? "bg-purple-700 text-white"
                            : "bg-[#FFD100] text-black"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                  <span className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold shadow">
                    +
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-base font-extrabold text-black">US$ {item.price}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* COMBOS */}
        <section className="px-4 py-8 max-w-3xl mx-auto">
          <h2 className="text-lg font-extrabold text-black mb-4">Combos</h2>
          <div className="space-y-3">
            {COMBOS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={openMenu}
                className="w-full flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm text-left active:scale-[0.99] transition"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-[#FFD100]/40 flex items-center justify-center text-3xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-black">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                  <p className="text-base font-extrabold text-black mt-1">US$ {item.price}</p>
                </div>
                <span className="w-11 h-11 rounded-full bg-purple-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
                  +
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* AVALIAÇÕES */}
        <section className="px-4 py-2 max-w-3xl mx-auto">
          <h2 className="text-lg font-extrabold text-black mb-4">Avaliações</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {REVIEWS.map((r) => (
              <div
                key={r.author}
                className="min-w-[240px] rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <p className="text-[#FFD100] text-sm tracking-tight" aria-label="5 estrelas">
                  ★★★★★
                </p>
                <p className="text-sm text-gray-800 mt-2 leading-snug">“{r.text}”</p>
                <p className="text-xs text-gray-400 mt-3 font-medium">{r.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FIDELIDADE */}
        <section className="px-4 py-8 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-black text-white p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD100] flex items-center justify-center text-2xl shrink-0">
              👑
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-base">Fidelidade King</p>
              <p className="text-sm text-white/70 mt-0.5">
                Ganhe pontos a cada compra e troque por descontos.
              </p>
            </div>
            <button
              type="button"
              onClick={openMenu}
              className="bg-[#FFD100] text-black text-xs font-extrabold px-3 py-2.5 rounded-full min-h-[44px] shrink-0"
            >
              Saiba mais
            </button>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-4 pb-6 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={openMenu}
            className="w-full min-h-[56px] bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base rounded-2xl py-4 shadow-lg shadow-purple-700/25 active:scale-[0.99] transition"
          >
            Ver cardápio completo →
          </button>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-white px-4 pt-8 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO} alt="King Food" className="w-12 h-12 object-contain rounded-lg" />
              <div>
                <p className="font-extrabold">King Food</p>
                <p className="text-xs text-white/55">Açaí Premium Delivery</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">
              O verdadeiro sabor do Brasil em Columbus, Ohio.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-green-500 text-white px-3 py-2 rounded-full min-h-[40px] flex items-center"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/king.food_delivery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold border border-white/20 text-white px-3 py-2 rounded-full min-h-[40px] flex items-center"
              >
                Instagram
              </a>
              <button
                type="button"
                onClick={openMenu}
                className="text-xs font-bold bg-[#FFD100] text-black px-3 py-2 rounded-full min-h-[40px]"
              >
                Cardápio
              </button>
            </div>
            <p className="text-[11px] text-white/35 border-t border-white/10 pt-4">
              © {new Date().getFullYear()} King Food · Columbus, OH
            </p>
          </div>
        </footer>
      </main>

      {/* BOTTOM NAV */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]"
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center gap-0.5 text-purple-700 min-w-[64px] min-h-[52px] justify-center"
          >
            <span className="text-xl" aria-hidden>
              🏠
            </span>
            <span className="text-[10px] font-semibold">Início</span>
          </button>
          <button
            type="button"
            onClick={openMenu}
            className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[64px] min-h-[52px] justify-center"
          >
            <span className="text-xl" aria-hidden>
              🍓
            </span>
            <span className="text-[10px] font-semibold">Cardápio</span>
          </button>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[64px] min-h-[52px] justify-center"
          >
            <span className="text-xl" aria-hidden>
              💬
            </span>
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[64px] min-h-[52px] justify-center"
          >
            <span className="text-xl" aria-hidden>
              👤
            </span>
            <span className="text-[10px] font-semibold">Conta</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
