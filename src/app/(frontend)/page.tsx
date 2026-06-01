import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getPayload } from "@/lib/payload";
import HeroV1 from "@/components/home/HeroV1";
import PostCard from "@/components/blog/PostCard";
import EventCard from "@/components/ui/EventCard";
import DownloadCard from "@/components/ui/DownloadCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro.",
};

export default async function HomePage() {
  const payload = await getPayload();

  const [postsResult, eventsResult, downloadsResult] = await Promise.allSettled(
    [
      payload.find({
        collection: "posts",
        where: { published: { equals: true } },
        sort: "-date",
        limit: 3,
      }),
      payload.find({ collection: "events", sort: "date", limit: 4 }),
      payload.find({ collection: "downloads", sort: "-date", limit: 4 }),
    ],
  );

  const posts =
    postsResult.status === "fulfilled" ? postsResult.value.docs : [];
  const events =
    eventsResult.status === "fulfilled" ? eventsResult.value.docs : [];
  const downloads =
    downloadsResult.status === "fulfilled" ? downloadsResult.value.docs : [];

  const highlightEvent = events.find((e) => e.highlight) ?? events[0] ?? null;

  return (
    <>
      {/* ─── Hero ─── */}
      <HeroV1 />

      {/* ─── Próximo evento em destaque ─── */}
      {highlightEvent && (
        <section
          className="section"
          style={{ background: "var(--teal-500)", color: "white" }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <Icon
              icon="material-symbols:event-outline-rounded"
              style={{ fontSize: 32, opacity: 0.8 }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {highlightEvent.title}
              </p>
              <p style={{ opacity: 0.85, fontSize: 14, marginTop: 4 }}>
                {highlightEvent.time} · {highlightEvent.location}
                {highlightEvent.recurring && ` · ${highlightEvent.recurring}`}
              </p>
            </div>
            <Link
              href="/agenda"
              className="btn btn-white btn-md"
              style={{ flexShrink: 0 }}
            >
              Ver agenda →
            </Link>
          </div>
        </section>
      )}

      {/* ─── Últimos posts ─── */}
      <section className="section section-bg">
        <div className="container">
          <p className="section-label">Blog</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Devocionais e Estudos
            </h2>
            <Link href="/blog" className="btn btn-outline btn-sm">
              Ver todos
            </Link>
          </div>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agenda de eventos ─── */}
      <section className="section">
        <div className="container agenda-downloads-grid">
          <div>
            <p className="section-label">Agenda</p>
            <h2 className="section-title">Próximos eventos</h2>
            <p className="section-desc">
              Venha viver conosco. Cada encontro é uma oportunidade de ser
              família.
            </p>
            <div style={{ marginTop: 32 }}>
              <div className="events-list">
                {events.map((ev) => (
                  <EventCard key={ev.id} event={ev as any} />
                ))}
              </div>
            </div>
            <Link
              href="/agenda"
              className="btn btn-outline btn-md"
              style={{ marginTop: 24 }}
            >
              Ver agenda completa →
            </Link>
          </div>

          {/* ─── Downloads recentes ─── */}
          <div>
            <p className="section-label">Downloads</p>
            <h2 className="section-title">Materiais recentes</h2>
            <p className="section-desc">
              Áudios, PDFs e slides para aprofundar o estudo em casa.
            </p>
            <div style={{ marginTop: 32 }}>
              <div className="downloads-list">
                {downloads.map((dl) => (
                  <DownloadCard key={dl.id} item={dl as any} />
                ))}
              </div>
            </div>
            <Link
              href="/downloads"
              className="btn btn-outline btn-md"
              style={{ marginTop: 24 }}
            >
              Ver todos os materiais →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="section section-navy">
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: 560, marginInline: "auto" }}
        >
          <p className="section-label" style={{ color: "var(--teal-400)" }}>
            Igreja no Rio
          </p>
          <h2 className="section-title" style={{ color: "white" }}>
            Um lugar para chamar de casa
          </h2>
          <p
            className="section-desc"
            style={{ color: "rgba(255,255,255,.65)", marginInline: "auto" }}
          >
            Não importa de onde você vem ou como chegou até aqui. Há lugar para
            você.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            <Link href="/cultos" className="btn btn-primary btn-lg">
              Venha no domingo
            </Link>
            <Link
              href="/contato"
              className="btn btn-outline btn-lg"
              style={{ borderColor: "rgba(255,255,255,.3)", color: "white" }}
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
