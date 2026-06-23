import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { YOUTUBE_CHANNEL_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Igreja no Rio. Endereço, e-mail e canais de contato em Santíssimo, RJ.",
  openGraph: { title: "Contato — Igreja no Rio" },
};

export default function ContatoPage() {
  return (
    <>
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Fale conosco</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Ficamos felizes em te ouvir
          </h1>
          <p className="section-desc page-intro-copy">
            Tem alguma dúvida, quer visitar ou saber mais sobre os grupos
            caseiros? Chama a gente!
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div>
            <h2 className="section-title section-block-title">Informações</h2>

            <div className="icon-detail-list">
              <div className="icon-detail-item">
                <div className="icon-detail-icon">
                  <Icon
                    icon="material-symbols:location-on-outline-rounded"
                    style={{ fontSize: 22 }}
                  />
                </div>
                <div>
                  <p className="icon-detail-title">Endereço</p>
                  <p className="supporting-copy">
                    Rua Ivan Pessoa, 341
                    <br />
                    Santíssimo — Rio de Janeiro, RJ
                  </p>
                </div>
              </div>

              <div className="icon-detail-item">
                <div className="icon-detail-icon">
                  <Icon
                    icon="material-symbols:mail-outline-rounded"
                    style={{ fontSize: 22 }}
                  />
                </div>
                <div>
                  <p className="icon-detail-title">E-mail</p>
                  <a
                    href="mailto:contato@igrejanorio.com"
                    style={{ color: "var(--accent)", fontSize: 14 }}
                  >
                    contato@igrejanorio.com
                  </a>
                </div>
              </div>

              <div className="icon-detail-item">
                <div className="icon-detail-icon">
                  <Icon icon="mdi:whatsapp" style={{ fontSize: 22 }} />
                </div>
                <div>
                  <p className="icon-detail-title">WhatsApp</p>
                  <a
                    href="https://wa.me/5521996647023"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)", fontSize: 14 }}
                  >
                    (21) 99664-7023
                  </a>
                </div>
              </div>

              <div className="icon-detail-item">
                <div className="icon-detail-icon">
                  <Icon icon="mdi:youtube" style={{ fontSize: 22 }} />
                </div>
                <div>
                  <p className="icon-detail-title">YouTube</p>
                  <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)", fontSize: 14 }}
                  >
                    @IgrejanoRio7
                  </a>
                </div>
              </div>

              <div className="icon-detail-item">
                <div className="icon-detail-icon">
                  <Icon
                    icon="material-symbols:schedule-outline-rounded"
                    style={{ fontSize: 22 }}
                  />
                </div>
                <div>
                  <p className="icon-detail-title">Encontros</p>
                  <p className="supporting-copy">
                    Nossa reunião geral acontece aos domingos, às 10h00.
                    <br />
                    Durante a semana, os grupos caseiros se reúnem em casas
                    espalhadas pela cidade.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="surface-card surface-card-muted"
              style={{ marginTop: 40 }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                Canais de contato
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p className="supporting-copy" style={{ margin: 0 }}>
                  Este site nao envia as informacoes digitadas em um formulario de contato. Para falar com a igreja, use um canal funcional abaixo.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <a
                    href="https://wa.me/5521996647023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-md"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon icon="mdi:whatsapp" style={{ fontSize: 18 }} />
                    WhatsApp
                  </a>
                  <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon icon="mdi:youtube" style={{ fontSize: 18 }} />
                    YouTube
                  </a>
                  <a
                    href="mailto:contato@igrejanorio.com"
                    className="btn btn-outline btn-md"
                  >
                    Enviar e-mail
                  </a>
                  <Link href="/privacidade" className="btn btn-outline btn-md">
                    Ver política de privacidade
                  </Link>
                </div>
                <p className="supporting-copy" style={{ margin: 0 }}>
                  Se voce entrar em contato por e-mail, seus dados serao usados apenas para responder sua mensagem e conduzir o atendimento solicitado. Leia a <Link href="/privacidade">Política de Privacidade</Link> para mais detalhes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
