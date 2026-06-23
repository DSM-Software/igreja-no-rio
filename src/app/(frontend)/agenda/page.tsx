import type { Metadata } from "next";
import Link from "next/link";
import { getPayload } from "@/lib/payload";
import EventCard from "@/components/ui/EventCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Veja a programação de eventos e encontros da Igreja no Rio — Santíssimo, RJ.",
  openGraph: { title: "Agenda — Igreja no Rio" },
};

export default async function AgendaPage() {
  const payload = await getPayload();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });

  const eventsResult = await payload
    .find({ collection: "events", sort: "date", limit: 20, where: {} })
    .catch(() => ({ docs: [] }));

  // Tie-break por horário em memória. O campo `date` no banco guarda
  // timestamp completo (HH:MM:SS variável por registro), então o sort
  // do Payload `date,time` não dispara o tie-breaker `time` — dois
  // eventos do mesmo dia nunca empatam em `date`. Aqui normalizamos
  // pra dia e usamos `time` (HH:MM) como segundo critério.
  const dayPart = (d: string | null | undefined) => (d ?? "").slice(0, 10);
  const events = [...eventsResult.docs].sort((a, b) => {
    const cmp = dayPart(a.date).localeCompare(dayPart(b.date));
    return cmp !== 0 ? cmp : (a.time ?? "").localeCompare(b.time ?? "");
  });

  const recurringEvents = events.filter((e) => e.recurring);
  const upcomingEvents = events.filter(
    (e) => !e.recurring && (!e.date || e.date >= today),
  );
  const hasContent = recurringEvents.length > 0 || upcomingEvents.length > 0;

  return (
    <>
      {/* Page hero */}
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Nossa programação</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            O que está acontecendo
          </h1>
          <p className="section-desc page-intro-copy">
            Confira os próximos eventos e encontros. Você é sempre bem-vindo.
          </p>
        </div>
      </div>

      {/* Events */}
      <section className="section">
        <div className="container">
          {!hasContent ? (
            <div className="surface-card surface-card-muted">
              <p>
                Nenhum evento programado no momento. Fique de olho por aqui ou
                entre em contato conosco para saber mais.
              </p>
              <Link
                href="/contato"
                className="btn btn-primary btn-md"
                style={{ marginTop: 20, display: "inline-block" }}
              >
                Entrar em contato
              </Link>
            </div>
          ) : (
            <>
              {recurringEvents.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <h2 className="section-title section-block-title">
                    Encontros regulares
                  </h2>
                  <div className="events-list">
                    {recurringEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="section-title section-block-title">
                    Próximos eventos
                  </h2>
                  <div className="events-list">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
