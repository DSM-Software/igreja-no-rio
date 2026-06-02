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
        <section className="bg-brand-500 py-10 text-white">
          <div className="mx-auto flex w-full max-w-content flex-wrap items-center gap-6 px-4 md:px-8">
            <Icon
              icon="material-symbols:event-outline-rounded"
              style={{ fontSize: 32, opacity: 0.8 }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold">
                {highlightEvent.title}
              </p>
              <p className="mt-1 text-sm text-white/85">
                {highlightEvent.time} · {highlightEvent.location}
                {highlightEvent.recurring && ` · ${highlightEvent.recurring}`}
              </p>
            </div>
            <Link
              href="/agenda"
              className="inline-flex h-10 shrink-0 items-center rounded-full border border-white/20 bg-white/15 px-5 font-display text-sm font-semibold text-white transition-colors hover:bg-white/25"
            >
              Ver agenda →
            </Link>
          </div>
        </section>
      )}

      {/* ─── Últimos posts ─── */}
      <section className="bg-bg py-20">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Blog
          </p>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[clamp(30px,4.2vw,48px)] font-bold tracking-[-0.02em] text-ink">
              Devocionais e Estudos
            </h2>
            <Link
              href="/blog"
              className="inline-flex h-9 items-center rounded-full border border-border px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agenda de eventos ─── */}
      <section className="py-20">
        <div className="mx-auto grid w-full max-w-content gap-10 px-4 md:px-8 lg:grid-cols-2">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Agenda
            </p>
            <h2 className="mt-2 font-display text-[clamp(30px,4.2vw,44px)] font-bold tracking-[-0.02em] text-ink">
              Próximos eventos
            </h2>
            <p className="mt-3 max-w-[58ch] text-base leading-8 text-ink-2">
              Venha viver conosco. Cada encontro é uma oportunidade de ser
              família.
            </p>
            <div className="mt-8">
              <div className="space-y-4">
                {events.map((ev) => (
                  <EventCard key={ev.id} event={ev as any} />
                ))}
              </div>
            </div>
            <Link
              href="/agenda"
              className="mt-6 inline-flex h-10 items-center rounded-full border border-border px-5 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              Ver agenda completa →
            </Link>
          </div>

          {/* ─── Downloads recentes ─── */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Downloads
            </p>
            <h2 className="mt-2 font-display text-[clamp(30px,4.2vw,44px)] font-bold tracking-[-0.02em] text-ink">
              Materiais recentes
            </h2>
            <p className="mt-3 max-w-[58ch] text-base leading-8 text-ink-2">
              Áudios, PDFs e slides para aprofundar o estudo em casa.
            </p>
            <div className="mt-8">
              <div className="space-y-4">
                {downloads.map((dl) => (
                  <DownloadCard key={dl.id} item={dl as any} />
                ))}
              </div>
            </div>
            <Link
              href="/downloads"
              className="mt-6 inline-flex h-10 items-center rounded-full border border-border px-5 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              Ver todos os materiais →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto w-full max-w-[560px] px-4 text-center md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
            Igreja no Rio
          </p>
          <h2 className="mt-2 font-display text-[clamp(30px,4.2vw,44px)] font-bold tracking-[-0.02em] text-white">
            Um lugar para chamar de casa
          </h2>
          <p className="mt-4 text-base leading-8 text-white/70">
            Não importa de onde você vem ou como chegou até aqui. Há lugar para
            você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/cultos"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Venha no domingo
            </Link>
            <Link
              href="/contato"
              className="inline-flex h-11 items-center rounded-full border border-white/35 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
