import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Cultos",
  description:
    "Reunião geral da Igreja no Rio aos domingos, às 10h, e grupos caseiros em casas espalhadas pela cidade.",
  openGraph: { title: "Cultos — Igreja no Rio" },
};

const SCHEDULE = [
  {
    day: "Domingo",
    time: "10h00",
    title: "Reunião Geral da Família",
    desc: "Nossa única reunião geral: um tempo de adoração, Palavra e comunhão para toda a família.",
    highlight: true,
  },
];

export default function CultosPage() {
  return (
    <>
      {/* Page hero */}
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Nossos cultos</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 600 }}
          >
            Você é bem-vindo toda semana
          </h1>
          <p className="section-desc page-intro-copy">
            Na Igreja no Rio nossa reunião geral acontece no domingo, às 10h.
            Durante a semana, vivemos a fé em grupos caseiros espalhados pela
            cidade.
          </p>
        </div>
      </div>

      {/* Schedule */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Horários</h2>
          <div className="content-list">
            {SCHEDULE.map((s) => (
              <div
                key={s.day}
                className={`schedule-card ${s.highlight ? "schedule-card-highlight" : ""}`}
              >
                <div className="schedule-card-time">
                  <p className="schedule-card-day">{s.day}</p>
                  <p className="schedule-card-hour">{s.time}</p>
                </div>
                <div className="schedule-card-body">
                  <p className="schedule-card-title">{s.title}</p>
                  <p className="schedule-card-copy">{s.desc}</p>
                </div>
                {s.highlight && (
                  <span className="tag tag-teal schedule-card-tag">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="section section-bg">
        <div className="container content-grid-2 content-grid-align-center content-grid-tight">
          <div>
            <p className="section-label">Como chegar</p>
            <h2 className="section-title">Nosso endereço</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 24,
              }}
            >
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <Icon
                  icon="material-symbols:location-on-outline-rounded"
                  style={{
                    fontSize: 22,
                    color: "var(--accent)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 16 }}>
                    Rua Ivan Pessoa, 341
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>
                    Santíssimo — Rio de Janeiro, RJ
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <Icon
                  icon="material-symbols:directions-bus-outline-rounded"
                  style={{
                    fontSize: 22,
                    color: "var(--accent)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Fácil acesso pelo ônibus e metro. Estacionamento disponível
                  próximo ao local.
                </p>
              </div>
            </div>
            <Link
              href="/contato"
              className="btn btn-primary btn-md"
              style={{ marginTop: 28 }}
            >
              Fale conosco
            </Link>
          </div>

          {/* Map placeholder */}
          <div className="feature-placeholder">
            <Icon
              icon="material-symbols:map-outline-rounded"
              style={{ fontSize: 48 }}
            />
            <p style={{ fontSize: 14 }}>Mapa em breve</p>
          </div>
        </div>
      </section>

      {/* Grupos caseiros */}
      <section className="section">
        <div className="container narrow-section">
          <p className="section-label">Grupos caseiros</p>
          <h2 className="section-title">A igreja acontece nas casas</h2>
          <p
            style={{ color: "var(--ink-2)", lineHeight: 1.8, marginBottom: 20 }}
          >
            Os grupos caseiros são reuniões que acontecem em casas de pessoas da
            igreja, espalhadas pela cidade.
          </p>
          <p
            style={{ color: "var(--ink-2)", lineHeight: 1.8, marginBottom: 32 }}
          >
            Não é uma reunião com data e hora rígidas em um único endereço. Para
            participar, fale com a gente e vamos indicar um grupo perto de você.
          </p>
          <Link href="/contato" className="btn btn-primary btn-md">
            Quero encontrar um grupo
          </Link>
        </div>
      </section>
    </>
  );
}
