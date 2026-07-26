"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-acaiDark px-4 text-center">
      <div className="mb-6 text-6xl">📡</div>
      <h1 className="mb-4 font-display text-3xl font-bold text-white">Você está offline</h1>
      <p className="mb-8 max-w-sm text-brand-cream/70">
        Parece que você perdeu a conexão. Verifique sua internet e tente novamente.
      </p>
      <button onClick={() => window.location.reload()} className="btn-primary text-lg">
        🔄 Tentar Novamente
      </button>
    </div>
  );
}
