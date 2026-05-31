import type { Metadata } from "next";
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
      <div
        className="page-hero"
        style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}
      >
        <div className="container">
          <p className="section-label">Nossa história</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 640 }}
          >
            Somos uma família plantada em Santíssimo
          </h1>
        </div>
      </div>

      {/* Missão */}
      <section className="section">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <p className="section-label">Missão</p>
            <h2 className="section-title">
              Para que todos conheçam e amem Jesus
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              A Igreja no Rio nasceu do desejo de ser uma comunidade genuína no
              coração do Rio de Janeiro — um lugar onde a fé se vive de perto,
              nas casas, nas mesas e nas ruas de Santíssimo.
            </p>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.8 }}>
              Acreditamos que a igreja é o povo de Deus vivendo junto, não
              apenas um evento de domingo. Por isso nossa ênfase está nos grupos
              caseiros, na amizade real e no discipulado do dia a dia.
            </p>
          </div>
          <div
            style={{
              height: 400,
              borderRadius: "var(--r-2xl)",
              background:
                "linear-gradient(135deg, var(--teal-200), var(--teal-500))",
            }}
          />
        </div>
      </section>

      {/* Valores */}
      <section className="section section-bg">
        <div className="container">
          <p className="section-label" style={{ textAlign: "center" }}>
            Nossos valores
          </p>
          <h2
            className="section-title"
            style={{
              textAlign: "center",
              marginInline: "auto",
              marginBottom: 48,
            }}
          >
            O que nos guia
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Palavra",
                desc: "A Bíblia é a fundação de tudo que fazemos — pregamos, ensinamos e vivemos a partir dela.",
              },
              {
                title: "Comunidade",
                desc: "Acreditamos na igreja que vive em comunhão nas casas. Grupos caseiros são o coração do nosso relacionamento.",
              },
              {
                title: "Missão",
                desc: "A igreja existe para servir a cidade. Amamos Santíssimo e o Rio como missão de vida.",
              },
              {
                title: "Graça",
                desc: "Somos movidos pela graça — não pela religião. Aqui você é recebido como você é.",
              },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "28px 24px",
                  background: "var(--paper)",
                  borderRadius: "var(--r-xl)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "var(--teal-700)",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--ink-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liderança pastoral */}
      <section className="section">
        <div className="container">
          <p className="section-label">Liderança</p>
          <h2 className="section-title">
            Cuidado pastoral e vida em comunidade
          </h2>
          <div
            style={{
              marginTop: 32,
              padding: "28px 24px",
              background: "var(--paper)",
              borderRadius: "var(--r-xl)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              Nosso cuidado pastoral acontece de forma próxima e relacional, com
              acompanhamento espiritual, oração e encorajamento para cada fase
              da vida.
            </p>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.8 }}>
              Esse cuidado se fortalece na convivência da igreja local,
              especialmente nos grupos caseiros espalhados pela cidade, onde a
              fé é vivida no dia a dia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-bg">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">Quer nos conhecer pessoalmente?</h2>
          <p
            className="section-desc"
            style={{ marginInline: "auto", marginBottom: 32 }}
          >
            Venha no domingo, às 10h, para nossa reunião geral, ou fale com a
            gente para encontrar um grupo caseiro perto de você.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/cultos" className="btn btn-primary btn-lg">
              Ver horários dos cultos
            </Link>
            <Link href="/contato" className="btn btn-outline btn-lg">
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
