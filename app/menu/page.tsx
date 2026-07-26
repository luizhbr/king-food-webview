import { OLACLICK_URL } from "@/lib/constants";

export default function MenuPage() {
  return (
    <div className="min-h-[80vh] px-4 py-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 font-display text-4xl font-bold text-white">Cardápio</h1>
        <p className="mb-8 text-lg text-brand-cream/70">
          Clique no botão abaixo para acessar nosso cardápio completo e fazer seu pedido.
        </p>
        <div className="glass-card flex flex-col items-center gap-6 p-8">
          <div className="text-6xl">🥤</div>
          <p className="text-brand-cream">
            Nosso cardápio completo está disponível através da plataforma OlaClick, onde você pode
            fazer seu pedido de forma segura e rápida.
          </p>
          <a
            href={OLACLICK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg"
          >
            🛒 Abrir Cardápio Completo
          </a>
        </div>
      </div>
    </div>
  );
}
