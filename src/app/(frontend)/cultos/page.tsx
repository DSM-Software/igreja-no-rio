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
      <div
        className="page-hero"
        style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}
      >
        <div className="container">
          <p className="section-label">Nossos cultos</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 600 }}
          >
            Você é bem-vindo toda semana
          </h1>
          <p className="section-desc" style={{ marginTop: 16 }}>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 32,
            }}
          >
            {SCHEDULE.map((s) => (
              <div
                key={s.day}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "24px 28px",
                  background: s.highlight ? "var(--teal-50)" : "var(--paper)",
                  border: `1px solid ${s.highlight ? "var(--teal-200)" : "var(--border)"}`,
                  borderRadius: "var(--r-xl)",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flexShrink: 0, minWidth: 80 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: s.highlight ? "var(--teal-700)" : "var(--ink)",
                    }}
                  >
                    {s.day}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 28,
                      color: s.highlight ? "var(--teal-600)" : "var(--accent)",
                      lineHeight: 1.1,
                    }}
                  >
                    {s.time}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      marginBottom: 6,
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      color: "var(--ink-2)",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
                {s.highlight && (
                  <span
                    className="tag tag-teal"
                    style={{ marginInlineStart: "auto", flexShrink: 0 }}
                  >
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
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
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
              Fale conosco para mais info
            </Link>
          </div>

          {/* Map placeholder */}
          <div
            style={{
              height: 360,
              borderRadius: "var(--r-2xl)",
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              flexDirection: "column",
              gap: 12,
            }}
          >
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
        <div className="container" style={{ maxWidth: 680 }}>
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
