import { HOURS, OLACLICK_URL, CONTACT_INFO } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-acai via-brand-acaiDark to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.3),transparent_50%)]" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-brand-gold bg-white/10 shadow-2xl backdrop-blur-sm">
            <span className="font-display text-4xl font-bold text-brand-gold">KF</span>
          </div>

          <h1 className="mb-3 font-display text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            King Food
          </h1>

          <p className="mb-2 text-xl font-semibold text-brand-gold sm:text-2xl">
            Açaí Delivery em Columbus, OH
          </p>

          <p className="mb-8 max-w-md text-base text-brand-cream/70">
            O verdadeiro sabor do açaí brasileiro, direto na sua casa. Peça online com entrega
            rápida e prática.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/menu" className="btn-primary text-lg">
              📋 Ver Cardápio
            </a>
            <a
              href={OLACLICK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg"
            >
              🛒 Pedir Agora
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-slow">
          <svg
            className="h-6 w-6 text-brand-gold/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="bg-brand-acaiDark px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-white">
            Por que escolher o King Food?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <FeatureCard
              icon="🍓"
              title="Açaí Autêntico"
              description="Açaí puro importado, cremoso e saboroso como no Brasil."
            />
            <FeatureCard
              icon="🚀"
              title="Entrega Rápida"
              description="Delivery ágil em toda a região de Columbus, Ohio."
            />
            <FeatureCard
              icon="📱"
              title="Peça pelo App"
              description="Instale nosso app e peça com ainda mais facilidade."
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-acaiDark to-brand-acai px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-white">
            🕐 Horário de Funcionamento
          </h2>
          <div className="glass-card overflow-hidden">
            <ul className="divide-y divide-white/5">
              {HOURS.map((item) => (
                <li
                  key={item.day}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/5"
                >
                  <span className="font-medium text-brand-cream">{item.day}</span>
                  <span className="font-semibold text-brand-gold">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-acai px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Pronto para pedir?
          </h2>
          <p className="mb-8 text-lg text-brand-cream/70">
            Faça seu pedido agora mesmo e aproveite o melhor açaí de Columbus!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={OLACLICK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg"
            >
              🛒 Fazer Pedido
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-6 text-center transition-transform hover:scale-105">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 font-display text-xl font-bold text-brand-gold">{title}</h3>
      <p className="text-sm text-brand-cream/70">{description}</p>
    </div>
  );
}
