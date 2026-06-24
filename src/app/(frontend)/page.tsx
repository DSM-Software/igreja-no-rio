import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getPayload } from "@/lib/payload";
import HeroV1 from "@/components/home/HeroV1";
import PostCard from "@/components/blog/PostCard";
import EventCard from "@/components/ui/EventCard";
import DownloadCard from "@/components/ui/DownloadCard";
import { YOUTUBE_CHANNEL_URL } from "@/lib/links";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Faça parte dessa família",
  description:
    "Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro.",
};

export default async function HomePage() {
  const payload = await getPayload();

  // "Hoje" no fuso de São Paulo (mesma regra da /agenda) para excluir eventos passados.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });

  const [postsResult, eventsResult, downloadsResult] = await Promise.allSettled(
    [
      payload.find({
        collection: "posts",
        where: { published: { equals: true } },
        sort: "-date",
        limit: 3,
      }),
      // Apenas eventos elegíveis: recorrentes ou com data de hoje/futura.
      // O filtro na query evita que eventos passados ocupem o limit e escondam os futuros.
      payload.find({
        collection: "events",
        // Tie-break por horário acontece em memória depois do fetch
        // (ver agenda/page.tsx para o porquê). Aqui buscamos mais que 4
        // pra garantir que o sort em memória tenha de onde tirar os 4
        // realmente mais próximos.
        sort: "date",
        limit: 10,
        where: {
          or: [
            { recurring: { exists: true } },
            { date: { greater_than_equal: today } },
          ],
        },
      }),
      payload.find({ collection: "downloads", sort: ["-date"], limit: 4 }),
    ],
  );

  const posts =
    postsResult.status === "fulfilled" ? postsResult.value.docs : [];
  const dayPart = (d: string | null | undefined) => (d ?? "").slice(0, 10);
  const rawEvents =
    eventsResult.status === "fulfilled" ? eventsResult.value.docs : [];
  const events = [...rawEvents]
    .sort((a, b) => {
      const cmp = dayPart(a.date).localeCompare(dayPart(b.date));
      return cmp !== 0 ? cmp : (a.time ?? "").localeCompare(b.time ?? "");
    })
    .slice(0, 4);
  const downloads =
    downloadsResult.status === "fulfilled" ? downloadsResult.value.docs : [];

  // events já vem filtrado (recorrentes + futuros) e ordenado por data+hora:
  // respeita o flag editorial highlight quando não-passado, senão cai no
  // próximo evento mais próximo.
  const highlightEvent = events.find((e) => e.highlight) ?? events[0] ?? null;

  return (
    <>
      {/* ─── Hero ─── */}
      <HeroV1 backgroundImage="/images/community/boas-vindas.png" />

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

      {/* ─── Destaque do canal no YouTube ─── */}
      <section className="bg-bg-2 py-20">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-navy-900 px-6 py-12 text-center shadow-soft md:flex-row md:px-12 md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Icon icon="mdi:youtube" style={{ fontSize: 40 }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
                YouTube
              </p>
              <h2 className="mt-2 font-display text-[clamp(26px,3.6vw,38px)] font-bold tracking-[-0.02em] text-white">
                Acompanhe nossos cultos e mensagens
              </h2>
              <p className="mt-3 max-w-[56ch] text-base leading-8 text-white/70">
                Assista às pregações, louvores e momentos da nossa comunidade.
                Inscreva-se no canal para não perder nada.
              </p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <Icon icon="mdi:youtube" style={{ fontSize: 18 }} />
              Inscreva-se no canal
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-20">
        {/* Foto de comunhão ao fundo (espelha "Conte conosco" da referência) */}
        <Image
          src="/images/community/comunhao.png"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,29,41,.82)_0%,rgba(22,29,41,.92)_100%)]" />
        <div className="relative mx-auto w-full max-w-[560px] px-4 text-center md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
            Igreja no Rio
          </p>
          <h2 className="mt-2 font-display text-[clamp(30px,4.2vw,44px)] font-bold tracking-[-0.02em] text-white">
            Venha fazer parte da familia
          </h2>
          <p className="mt-4 text-base leading-8 text-white/70">
            Não importa de onde você vem ou como chegou até aqui. Há lugar para
            você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/agenda"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Ver agenda
            </Link>
            <a
              href="https://wa.me/5521996647023"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 px-6 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Icon icon="mdi:whatsapp" style={{ fontSize: 18 }} />
              Fale conosco
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
