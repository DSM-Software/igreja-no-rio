import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Somos parte da igreja na cidade do Rio de Janeiro — não vamos à igreja, somos a igreja. Você está em casa.",
  openGraph: { title: "Quem Somos — Igreja no Rio" },
};

export default function QuemSomosPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-bg pt-[calc(76px+64px)] pb-16">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Nossa identidade
          </p>
          <h1
            className="mt-3 font-display font-bold tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(36px, 6vw, 64px)", maxWidth: 640 }}
          >
            Somos uma família plantada em Santíssimo
          </h1>
        </div>
      </div>

      {/* Quem Somos */}
      <section className="bg-bg-2 py-20">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2
                className="font-display font-bold leading-[1.0] tracking-[-0.02em] text-brand-500"
                style={{ fontSize: "clamp(44px, 6vw, 72px)" }}
              >
                Quem
                <br />
                Somos
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-lg leading-8 text-ink">
                Somos parte da igreja na cidade do Rio de Janeiro, e celebramos
                nossos encontros neste sítio no Monte do Santíssimo. Você não
                está visitando uma organização. Está entre família.
              </p>
              <div className="space-y-1 border-l-4 border-brand-400 pl-5">
                <p className="font-display text-base font-bold leading-7 text-ink">
                  Não vamos à igreja — somos a igreja.
                </p>
                <p className="font-display text-base font-bold leading-7 text-ink">
                  E você também é parte dessa família.
                </p>
                <p className="font-display text-base font-bold leading-7 text-ink">
                  Por isso, está em casa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uma família de muitos filhos */}
      <section className="bg-brand-500 py-20">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2
                className="font-display font-extrabold leading-[1.05] text-white"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", maxWidth: 340 }}
              >
                Uma família de muitos filhos
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-base font-bold leading-8 text-white">
                O Pai tem um propósito eterno: uma família, de muitos filhos,
                conformes à imagem de Jesus, para o louvor da Sua glória.
              </p>
              <blockquote className="border-l-4 border-white/40 pl-5">
                <p className="text-sm italic leading-7 text-white/85">
                  &ldquo;Porque os que dantes conheceu, também os predestinou
                  para serem conformes à imagem de seu Filho, a fim de que ele
                  seja o primogênito entre muitos irmãos&rdquo;
                </p>
                <footer className="mt-2 text-sm font-semibold text-white/70">
                  Romanos 8:29
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Você é parte desse propósito */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto w-full max-w-[640px] px-4 text-center md:px-8">
          <p
            className="font-display font-light leading-[1.4] text-white/90"
            style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
          >
            Você é parte desse propósito.
            <br />
            Nós também.
          </p>
          <p
            className="mt-6 font-display font-extrabold leading-[1.2] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
          >
            É isso que nos reúne aqui.
          </p>
        </div>
      </section>

      {/* Seja bem-vindo / CTA */}
      <section className="bg-bg py-20">
        <div className="mx-auto w-full max-w-[580px] px-4 text-center md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Seja bem-vindo
          </p>
          <h2
            className="mt-3 font-display font-bold tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(30px, 4.2vw, 44px)" }}
          >
            Conte conosco!
          </h2>
          <p className="mt-4 text-base leading-8 text-ink-2">
            Desfrute da comunhão. E nos procure se precisar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/agenda"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Ver agenda
            </Link>
            <Link
              href="/contato"
              className="inline-flex h-11 items-center rounded-full border border-border px-6 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
