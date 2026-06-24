import { Icon } from "@iconify/react";
import { SERVO_LIVRE_URL } from "@/lib/links";

/**
 * Banner full-width de divulgação da editora parceira (Servo Livre).
 * Posicionado na home logo após a área de agenda/materiais.
 */
export default function PublisherBanner() {
  return (
    <section className="bg-gradient-to-br from-brand-500 to-brand-700 py-14 text-white">
      <div className="mx-auto flex w-full max-w-content flex-col items-center gap-8 px-4 text-center md:flex-row md:px-8 md:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Icon
            icon="material-symbols:auto-stories-outline-rounded"
            style={{ fontSize: 38 }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            Editora parceira
          </p>
          <h2 className="mt-2 font-display text-[clamp(26px,3.6vw,38px)] font-bold tracking-[-0.02em] text-white">
            Conheça nossos materiais
          </h2>
          <p className="mt-3 max-w-[56ch] text-base leading-8 text-white/85">
            Livros e estudos publicados pela Servo Livre para aprofundar sua fé
            e caminhar como família.
          </p>
        </div>
        <a
          href={SERVO_LIVRE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-display text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          <Icon
            icon="material-symbols:storefront-outline-rounded"
            style={{ fontSize: 18 }}
          />
          Visitar a loja
        </a>
      </div>
    </section>
  );
}
