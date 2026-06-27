import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a história, os valores e a visão da Igreja no Rio — uma comunidade cristã em Santíssimo, Rio de Janeiro.",
};

export default function QuemSomosPage() {
  return (
    <>
      {/* Page hero */}
      {/* <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Nossa história</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 640 }}
          >
            Somos uma família plantada em Santíssimo
          </h1>
        </div>
      </div> */}

      {/* Missão */}
      <section className="section">
        <div className="container content-grid-2 content-grid-align-center mt-4">
          <div>
            {/* <p className="section-label">Missão</p> */}
            <h2 className="section-title">Quem somos?</h2>
            <p className="mb-5 leading-8 text-ink-2">
              Somos homens e mulheres. Somos anciãos, adultos, jovens e
              crianças. Somos pais e filhos. Somos patrões e empregados;
              professores e alunos; militares e civis; empresários,
              empreendedores, publicitários, poetas e profetas. Somos ricos e
              pobres. Somos engenheiros e arquitetos; construtores e operários.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos livres, escravos e libertadores. Somos pastores e ovelhas;
              enviados, mestres e missionários. Somos artistas, músicos,
              cantores, bailarinos e verdadeiros adoradores.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos chefes e donas de casa; comerciantes e ambulantes. Somos
              funcionários públicos e privados. Somos profissionais autônomos e
              liberais. Somos jornalistas, escritores e leitores. Somos gente
              simples, mas também somos doutores.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos turistas, brasileiros e estrangeiros. Somos pilotos,
              passageiros e caminhoneiros. Somos atletas, caminhantes e
              cadeirantes.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos uma família, um corpo, uma casa, uma lavoura e um estilo de
              vida. Somos sal da terra e luz do mundo. Somos embaixadores,
              juízes e advogados. Somos guerreiros, abençoados e abençoadores.
              Somos um milagre. Somos um povo de propriedade exclusiva. Somos
              reis e sacerdotes.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos parte da igreja do Senhor Jesus Cristo na cidade do Rio de
              Janeiro.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Somos do bem. Somos de Deus. Somos filhos de Deus!
            </p>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-card bg-gradient-to-br from-brand-200 to-brand-500">
            <Image
              src="/images/community/adoracao.png"
              alt="Comunidade da Igreja no Rio reunida em adoração"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-bg">
        <div className="container centered-block narrow-section">
          <h2 className="section-title">Quer nos conhecer pessoalmente?</h2>
          <p
            className="section-desc centered-copy"
            style={{ marginBottom: 32 }}
          >
            Venha no domingo, às 10h, para nossa reunião geral, ou fale com a
            gente para encontrar um grupo caseiro perto de você.
          </p>
          <div className="inline-actions" style={{ justifyContent: "center" }}>
            <Link href="/cultos" className="btn btn-primary btn-lg">
              Ver horários dos cultos
            </Link>
            <a
              href="https://wa.me/5521996647023"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              Fale conosco
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
