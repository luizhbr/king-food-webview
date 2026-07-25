"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 100);

    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-screen bg-black overflow-hidden">
      {/* ========== TELA DE LOADING ========== */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD100]">
          {/* Logo com animação */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out
              ${
                showLogo
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }`}
          >
            <img
              src="/logo-kingfood.png.png"
              alt="King Food"
              className="w-48 h-48 object-contain drop-shadow-md"
            />
          </div>

          {/* Spinner */}
          <div
            className={`mt-8 transition-opacity duration-500 delay-300
              ${showLogo ? "opacity-100" : "opacity-0"}`}
          >
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p
            className={`text-black/70 text-xs mt-5 font-medium transition-opacity duration-500 delay-500
              ${showLogo ? "opacity-100" : "opacity-0"}`}
          >
            Carregando cardápio...
          </p>
        </div>
      )}

      {/* ========== HEADER ========== */}
      <header className="flex items-center justify-between px-4 py-3 bg-black text-white shadow-md z-20 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src="/logo-kingfood.png.png"
            alt="King Food"
            className="w-10 h-10 object-contain rounded-md"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">King Food</h1>
            <p className="text-xs text-gray-400">Açaí • Delivery</p>
          </div>
        </div>

        <a
          href="https://wa.me/12673107535"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-full transition"
        >
          WhatsApp
        </a>
      </header>

      {/* ========== IFRAME DO CARDÁPIO ========== */}
      <div className="flex-1 relative bg-white">
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
