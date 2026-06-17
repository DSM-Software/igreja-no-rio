import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a história, os valores e a visão da Igreja no Rio — uma comunidade cristã em Santíssimo, Rio de Janeiro.",
  openGraph: { title: "Quem Somos — Igreja no Rio" },
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
            <h2 className="section-title">Quem somos</h2>
            <p className="mb-5 leading-8 text-ink-2">
              Somos parte da igreja na cidade do Rio de Janeiro. Não vamos à
              igreja — somos a igreja. E você também pode fazer parte dessa
              família.
            </p>
            <p className="mb-5 leading-8 text-ink-2">
              Cremos que Deus como nosso Pai tem um propósito eterno: uma
              família, de muitos filhos, conformes à imagem de Jesus, para o
              louvor da Sua glória.
            </p>
            <blockquote className="border-l-4 border-brand-200 pl-4 italic leading-8 text-ink-2">
              “Porque os que dantes conheceu, também os predestinou para serem
              conformes à imagem de seu Filho, a fim de Ele seja o primogênito
              entre muitos irmãos”
              <footer className="mt-2 text-sm not-italic text-ink-2">
                Romanos 8:29
              </footer>
            </blockquote>
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
