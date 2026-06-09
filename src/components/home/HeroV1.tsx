// Hero "Acolhedora" — navy hero escuro com boas-vindas calorosas.
// Aceita uma foto de fundo opcional; sem ela (ou se a imagem falhar),
// mantém o degradê navy/teal como fallback.
import Image from "next/image";
import Link from "next/link";

interface HeroV1Props {
  /** Caminho da foto de fundo da comunidade (full-bleed). Opcional. */
  backgroundImage?: string;
  /** Texto alternativo. Fundo é decorativo por padrão (vazio). */
  backgroundAlt?: string;
}

export default function HeroV1({
  backgroundImage,
  backgroundAlt = "",
}: HeroV1Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 pt-40 pb-28">
      {backgroundImage ? (
        <>
          {/* Foto da comunidade — above-the-fold, carregada com prioridade */}
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover"
          />
          {/* Overlay de legibilidade (espelha o gradiente navy/teal original) */}
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(40,49,67,.86)_0%,rgba(22,29,41,.93)_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(92,200,189,.28),transparent_42%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#283143_0%,#161D29_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(92,200,189,.25),transparent_40%)]" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-content px-4 md:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
            Santíssimo · Rio de Janeiro
          </p>

          <h1 className="mt-5 font-display text-[clamp(44px,8vw,88px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-white">
            Você já foi
            <br />
            encontrado.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Somos uma família que vive, celebra e serve juntos no coração do
            Rio. Toda semana você é bem-vindo aqui — seja na sua primeira visita
            ou na décima vez.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/cultos"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Venha nos conhecer
            </Link>
            <Link
              href="/quem-somos"
              className="inline-flex h-11 items-center rounded-full border border-white/25 bg-white/10 px-6 font-display text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Quem somos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
