import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { getPayload } from "@/lib/payload";
import EventCard from "@/components/ui/EventCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Igreja no Rio. Endereço, telefone e agenda de eventos em Santíssimo, RJ.",
  openGraph: { title: "Contato — Igreja no Rio" },
};

export default async function ContatoPage() {
  const payload = await getPayload();
  const { docs: events } = await payload.find({
    collection: "events",
    sort: "date",
    limit: 8,
  });

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
        <div className="container content-grid-2 content-grid-tight">
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
                Envie uma mensagem
              </h3>
              <form
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Mensagem
                  </label>
                  <textarea
                    placeholder="Como posso te ajudar?"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-md"
                  style={{ alignSelf: "flex-start" }}
                >
                  Enviar mensagem
                </button>
              </form>
            </div>
          </div>

          <div>
            <h2 className="section-title section-block-title">
              Próximos eventos
            </h2>
            <p className="section-desc" style={{ marginBottom: 32 }}>
              Veja a agenda da igreja e escolha uma boa ocasião para nos
              visitar.
            </p>
            {events.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>Nenhum evento cadastrado.</p>
            ) : (
              <div className="events-list">
                {events.map((ev) => (
                  <EventCard key={ev.id} event={ev as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
