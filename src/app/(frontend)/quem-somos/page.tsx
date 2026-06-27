import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a história, os valores e a visão da Igreja no Rio — uma comunidade cristã em Santíssimo, Rio de Janeiro.",
};

export default function QuemSomosPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative isolate overflow-hidden bg-navy-900 pt-40 pb-28">
        <Image
          src="/images/community/adoracao.png"
          alt="Comunidade da Igreja no Rio reunida em adoração"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(40,49,67,.86)_0%,rgba(22,29,41,.93)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(92,200,189,.28),transparent_42%)]" />

        <div className="relative mx-auto w-full max-w-content px-4 md:px-8">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
              Nossa história
            </p>
            <h1 className="mt-5 font-display text-[clamp(40px,7vw,76px)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white">
              Quem somos?
            </h1>
          </div>
        </div>
      </section>

      {/* ─── Litania "Somos…" — apresentação editorial ─── */}
      <section className="bg-bg py-20 md:py-28">
        <div className="mx-auto w-full max-w-[68ch] px-4 md:px-8">
          {/* Acento decorativo de abertura */}
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-12 bg-brand-300" />
            <Icon
              icon="material-symbols:format-quote-rounded"
              className="text-brand-500"
              style={{ fontSize: 32 }}
            />
            <span className="h-px flex-1 bg-gradient-to-r from-brand-300 to-transparent" />
          </div>

          <div className="space-y-7 text-lg leading-9 text-ink-2">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[64px] first-letter:font-bold first-letter:leading-[0.7] first-letter:text-brand-600">
              Somos homens e mulheres. Somos anciãos, adultos, jovens e
              crianças. Somos pais e filhos. Somos patrões e empregados;
              professores e alunos; militares e civis; empresários,
              empreendedores, publicitários, poetas e profetas. Somos ricos e
              pobres. Somos engenheiros e arquitetos; construtores e operários.
            </p>
            <p>
              Somos livres, escravos e libertadores. Somos pastores e ovelhas;
              enviados, mestres e missionários. Somos artistas, músicos,
              cantores, bailarinos e verdadeiros adoradores.
            </p>
            <p>
              Somos chefes e donas de casa; comerciantes e ambulantes. Somos
              funcionários públicos e privados. Somos profissionais autônomos e
              liberais. Somos jornalistas, escritores e leitores. Somos gente
              simples, mas também somos doutores.
            </p>
            <p>
              Somos turistas, brasileiros e estrangeiros. Somos pilotos,
              passageiros e caminhoneiros. Somos atletas, caminhantes e
              cadeirantes.
            </p>
            <p>
              Somos uma família, um corpo, uma casa, uma lavoura e um estilo de
              vida. Somos sal da terra e luz do mundo. Somos embaixadores,
              juízes e advogados. Somos guerreiros, abençoados e abençoadores.
              Somos um milagre. Somos um povo de propriedade exclusiva. Somos
              reis e sacerdotes.
            </p>
            <p className="font-medium text-ink">
              Somos parte da igreja do Senhor Jesus Cristo na cidade do Rio de
              Janeiro.
            </p>
          </div>

          {/* Crescendo final */}
          <div className="mt-12 border-t border-border pt-10 text-center">
            <p className="font-display text-[clamp(26px,3.6vw,40px)] font-bold leading-tight tracking-[-0.01em] text-brand-700">
              Somos do bem. Somos de Deus. Somos filhos de Deus!
            </p>
          </div>
        </div>
      </section>

      {/* ─── Faixa de comunhão ─── */}
      <section className="relative h-[260px] overflow-hidden md:h-[360px]">
        <Image
          src="/images/community/comunhao.png"
          alt="Comunidade da Igreja no Rio reunida em comunhão"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/25" />
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-bg-2 py-20">
        <div className="mx-auto w-full max-w-[640px] px-4 text-center md:px-8">
          <h2 className="font-display text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.02em] text-ink">
            Quer nos conhecer pessoalmente?
          </h2>
          <p className="mt-4 text-base leading-8 text-ink-2">
            Venha no domingo, às 10h, para nossa reunião geral, ou fale com a
            gente para encontrar um grupo caseiro perto de você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/cultos"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Ver horários dos cultos
            </Link>
            <a
              href="https://wa.me/5521996647023"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              <Icon icon="mdi:whatsapp" style={{ fontSize: 18 }} />
              Fale conosco
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
