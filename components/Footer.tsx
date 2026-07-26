import { HOURS, CONTACT_INFO, APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 font-display text-xl font-bold text-brand-gold">{APP_NAME}</h3>
          <p className="text-sm text-brand-cream/60">
            O melhor açaí de Columbus, Ohio. Feito com ingredientes de qualidade e muito amor. 💜
          </p>
        </div>

        <div id="horarios">
          <h4 className="mb-3 font-display text-lg font-semibold text-white">Horários</h4>
          <ul className="space-y-1 text-sm text-brand-cream/60">
            {HOURS.map((item) => (
              <li key={item.day} className="flex justify-between gap-4">
                <span>{item.day}</span>
                <span className="text-brand-gold/80">{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-lg font-semibold text-white">Contato</h4>
          <ul className="space-y-2 text-sm text-brand-cream/60">
            <li>📍 {CONTACT_INFO.address}</li>
            <li>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand-gold"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="transition-colors hover:text-brand-gold"
              >
                ✉️ {CONTACT_INFO.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-white/5 pt-6 text-center">
        <p className="text-xs text-brand-cream/40">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
