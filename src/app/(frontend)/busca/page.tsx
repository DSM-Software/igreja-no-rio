import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { runSearch, type PostSearchHit, type EventSearchHit } from '@/lib/search'
import { fmtDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const RESULTS_PER_PAGE = 20

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Buscar — Igreja no Rio',
    robots: { index: false, follow: true },
  }
}

function buildPageUrl(q: string, page: number): string {
  const params = new URLSearchParams()
  params.set('q', q)
  if (page >= 2) params.set('page', String(page))
  return `/busca?${params.toString()}`
}

function PageNav({
  q,
  page,
  totalPages,
}: {
  q: string
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null
  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav
      aria-label="Paginação dos resultados"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {hasPrev ? (
        <Link
          href={buildPageUrl(q, page - 1)}
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink-2 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          ← Anterior
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-muted opacity-40"
        >
          ← Anterior
        </span>
      )}

      <span className="px-3 text-sm font-semibold text-ink-2">
        Página {page} de {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildPageUrl(q, page + 1)}
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink-2 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          Próxima →
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-muted opacity-40"
        >
          Próxima →
        </span>
      )}
    </nav>
  )
}

function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/busca"
      method="get"
      role="search"
      className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-soft"
    >
      <Icon
        icon="material-symbols:search-rounded"
        width={22}
        height={22}
        className="text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue ?? ''}
        placeholder="Buscar posts e eventos…"
        aria-label="Buscar"
        className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        autoFocus
        minLength={2}
        required
      />
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-full bg-brand-600 px-4 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Buscar
      </button>
    </form>
  )
}

function PostHitCard({ hit }: { hit: PostSearchHit }) {
  return (
    <article className="rounded-card border border-border bg-white p-5 shadow-soft transition-shadow hover:shadow-glow">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          {hit.category}
        </span>
        {hit.serie && (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            {hit.serie}
          </span>
        )}
      </div>

      <Link href={hit.url} className="mt-3 block">
        <h3 className="font-display text-[1.35rem] font-bold leading-tight text-ink transition-colors hover:text-brand-700">
          {hit.title}
        </h3>
      </Link>

      {hit.snippet && (
        <p className="mt-3 text-sm leading-7 text-ink-2">{hit.snippet}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{hit.author}</span>
        {hit.date && (
          <>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <span>{fmtDate(hit.date)}</span>
          </>
        )}
      </div>
    </article>
  )
}

function EventHitCard({ hit }: { hit: EventSearchHit }) {
  return (
    <article className="rounded-card border border-border bg-white p-5 shadow-soft transition-shadow hover:shadow-glow">
      <Link href={hit.url} className="block">
        <h3 className="font-display text-[1.35rem] font-bold leading-tight text-ink transition-colors hover:text-brand-700">
          {hit.title}
        </h3>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        {hit.recurring ? (
          <span className="inline-flex items-center gap-1">
            <Icon
              icon="material-symbols:event-repeat-rounded"
              width={14}
              height={14}
              aria-hidden="true"
            />
            {hit.recurring}
          </span>
        ) : (
          hit.date && (
            <span className="inline-flex items-center gap-1">
              <Icon
                icon="material-symbols:calendar-today-rounded"
                width={14}
                height={14}
                aria-hidden="true"
              />
              {fmtDate(hit.date)}
            </span>
          )
        )}
        {hit.time && (
          <>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <span className="inline-flex items-center gap-1">
              <Icon
                icon="material-symbols:schedule-rounded"
                width={14}
                height={14}
                aria-hidden="true"
              />
              {hit.time}
            </span>
          </>
        )}
        {hit.location && (
          <>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <span className="inline-flex items-center gap-1">
              <Icon
                icon="material-symbols:location-on-rounded"
                width={14}
                height={14}
                aria-hidden="true"
              />
              {hit.location}
            </span>
          </>
        )}
      </div>

      {hit.snippet && (
        <p className="mt-3 text-sm leading-7 text-ink-2">{hit.snippet}</p>
      )}
    </article>
  )
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q: rawQ, page: pageParam } = await searchParams
  const q = (rawQ ?? '').trim()

  if (!q || q.length < 2) {
    return (
      <>
        <div className="mx-auto w-full max-w-content px-4 pt-36 md:px-8">
          <div className="max-w-3xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Busca
            </p>
            <h1 className="mt-2 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em] text-ink">
              Buscar
            </h1>
            <p className="mt-4 text-base leading-8 text-ink-2">
              Digite o que você procura para começar.
            </p>
            <SearchForm defaultValue={rawQ ?? ''} />
          </div>
        </div>
        <section className="py-14" />
      </>
    )
  }

  const pageNumber = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const limit = RESULTS_PER_PAGE
  const offset = (pageNumber - 1) * limit

  const results = await runSearch({ q, type: 'all', limit, offset })
  const totalPages = Math.max(1, Math.ceil(results.total / limit))

  return (
    <>
      <div className="mx-auto w-full max-w-content px-4 pt-36 md:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Busca
          </p>
          <h1 className="mt-2 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em] text-ink">
            Resultados para “{q}”
          </h1>
          <p className="mt-4 text-base leading-8 text-ink-2">
            {results.total === 0
              ? 'Nenhum resultado encontrado.'
              : `${results.total} ${results.total === 1 ? 'resultado encontrado' : 'resultados encontrados'}.`}
          </p>
          <SearchForm defaultValue={q} />
        </div>
      </div>

      <section className="py-14">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          {results.total === 0 ? (
            <div className="rounded-card border border-border bg-white p-8 text-center text-muted shadow-soft">
              <p className="text-lg">
                Não encontramos posts ou eventos para essa busca.
              </p>
              <p className="mt-2 text-sm">
                Tente outras palavras-chave ou explore o{' '}
                <Link href="/blog" className="font-semibold text-brand-700 hover:underline">
                  blog
                </Link>{' '}
                e a{' '}
                <Link href="/agenda" className="font-semibold text-brand-700 hover:underline">
                  agenda
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {results.posts.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                    Posts{' '}
                    <span className="text-base font-semibold text-muted">
                      ({results.posts.length})
                    </span>
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {results.posts.map((hit) => (
                      <PostHitCard key={`post-${hit.id}`} hit={hit} />
                    ))}
                  </div>
                </div>
              )}

              {results.events.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                    Eventos{' '}
                    <span className="text-base font-semibold text-muted">
                      ({results.events.length})
                    </span>
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {results.events.map((hit) => (
                      <EventHitCard key={`event-${hit.id}`} hit={hit} />
                    ))}
                  </div>
                </div>
              )}

              <PageNav q={q} page={pageNumber} totalPages={totalPages} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
