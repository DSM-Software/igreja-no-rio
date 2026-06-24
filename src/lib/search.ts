import type { Pool } from 'pg'
import { getPayload } from './payload'

/**
 * Same SQL fragments as the GIN trigram indexes created in
 * `src/migrations/20260623_210000.ts`. Any change here MUST be mirrored there,
 * otherwise the index stops being used and queries fall back to seq scans.
 */
export const SEARCH_EXPR_POSTS =
  `coalesce("title", '') || ' ' || ` +
  `coalesce("excerpt", '') || ' ' || ` +
  `coalesce("serie", '') || ' ' || ` +
  `coalesce("author", '') || ' ' || ` +
  `coalesce("search_body", '')`

export const SEARCH_EXPR_EVENTS =
  `coalesce("title", '') || ' ' || ` +
  `coalesce("desc", '') || ' ' || ` +
  `coalesce("location", '') || ' ' || ` +
  `coalesce("recurring", '')`

export type PostSearchHit = {
  type: 'post'
  id: number
  title: string
  slug: string
  category: 'Devocional' | 'Estudo'
  serie: string | null
  author: string
  date: string
  snippet: string
  url: string
}

export type EventSearchHit = {
  type: 'event'
  id: number
  title: string
  date: string | null
  time: string | null
  location: string | null
  recurring: string | null
  snippet: string
  url: string
}

export type SearchResults = {
  posts: PostSearchHit[]
  events: EventSearchHit[]
  total: number
}

export type SearchOpts = {
  q: string
  type?: 'all' | 'posts' | 'events'
  limit?: number
  offset?: number
}

const EMPTY: SearchResults = { posts: [], events: [], total: 0 }

const MAX_QUERY_LENGTH = 80

/** Lower-case + strip diacritics for client-side substring matching when
 * generating snippets. Postgres handles the same on its side via f_unaccent. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function makeSnippet(rawText: string, q: string, maxLen = 160): string {
  const text = (rawText ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return ''

  const needle = normalize(q.trim())
  if (!needle) {
    return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text
  }

  const hay = normalize(text)
  const idx = hay.indexOf(needle)

  if (idx === -1) {
    return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text
  }

  // Center: leave ~20% of the window before the match, ~80% after.
  const before = Math.floor(maxLen * 0.2)
  let start = Math.max(0, idx - before)
  const end = Math.min(text.length, start + maxLen)
  // If we hit the end, shift `start` back so we still use the full window.
  if (end - start < maxLen) {
    start = Math.max(0, end - maxLen)
  }

  let slice = text.slice(start, end).trim()
  if (start > 0) slice = '…' + slice
  if (end < text.length) slice = slice + '…'
  return slice
}

function buildPostSnippet(row: PostRow, q: string): string {
  const fromBody = makeSnippet(row.search_body ?? '', q)
  if (fromBody) return fromBody
  const fromExcerpt = makeSnippet(row.excerpt ?? '', q)
  if (fromExcerpt) return fromExcerpt
  // Final fallback: any concatenated field text trimmed to 160.
  const concat = [row.title, row.excerpt, row.serie, row.author, row.search_body]
    .filter(Boolean)
    .join(' ')
    .trim()
  return concat ? concat.slice(0, 160) : ''
}

function buildEventSnippet(row: EventRow, q: string): string {
  const fromDesc = makeSnippet(row.desc ?? '', q)
  if (fromDesc) return fromDesc
  const fromLocation = makeSnippet(row.location ?? '', q)
  if (fromLocation) return fromLocation
  const concat = [row.title, row.desc, row.location, row.recurring]
    .filter(Boolean)
    .join(' ')
    .trim()
  return concat ? concat.slice(0, 160) : ''
}

type PostRow = {
  id: number
  title: string
  slug: string
  category: 'Devocional' | 'Estudo'
  serie: string | null
  author: string
  date: string | null
  excerpt: string | null
  search_body: string | null
}

type EventRow = {
  id: number
  title: string
  date: string | null
  time: string | null
  location: string | null
  recurring: string | null
  desc: string | null
}

type CountRow = { count: string }

function clampLimit(n: number | undefined): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 5
  const v = Math.floor(n)
  if (v < 1) return 1
  if (v > 50) return 50
  return v
}

function clampOffset(n: number | undefined): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 0
  const v = Math.floor(n)
  return v < 0 ? 0 : v
}

export async function runSearch(opts: SearchOpts): Promise<SearchResults> {
  // Cap length BEFORE trimming to keep the worst-case bounded regardless of
  // whitespace padding. Long needles slow down trigram similarity and could
  // be abused with `?q=<huge>` repeatedly to chew CPU.
  const q = (opts.q ?? '').slice(0, MAX_QUERY_LENGTH).trim()
  if (q.length < 2) return EMPTY

  const type: 'all' | 'posts' | 'events' = opts.type ?? 'all'
  const limit = clampLimit(opts.limit)
  const offset = clampOffset(opts.offset)

  const payload = await getPayload()
  // Payload's typings for `db` are intentionally loose since the adapter is
  // pluggable. The postgres adapter exposes the underlying pg Pool here.
  const pool = (payload.db as unknown as { pool: Pool }).pool

  const postsExpr = `lower(public.f_unaccent(${SEARCH_EXPR_POSTS}))`
  const eventsExpr = `lower(public.f_unaccent(${SEARCH_EXPR_EVENTS}))`
  const needleExpr = `'%' || lower(public.f_unaccent($1)) || '%'`

  const wantPosts = type === 'all' || type === 'posts'
  const wantEvents = type === 'all' || type === 'events'

  const postsListSql = `
    SELECT
      "id",
      "title",
      "slug",
      "category",
      "serie",
      "author",
      "date",
      "excerpt",
      "search_body"
    FROM "posts"
    WHERE "published" = true
      AND ${postsExpr} LIKE ${needleExpr}
    ORDER BY similarity(${SEARCH_EXPR_POSTS}, $1) DESC, "date" DESC
    LIMIT $2 OFFSET $3
  `

  const postsCountSql = `
    SELECT count(*)::text AS count
    FROM "posts"
    WHERE "published" = true
      AND ${postsExpr} LIKE ${needleExpr}
  `

  const eventsListSql = `
    SELECT
      "id",
      "title",
      "date",
      "time",
      "location",
      "recurring",
      "desc"
    FROM "events"
    WHERE ${eventsExpr} LIKE ${needleExpr}
    ORDER BY
      similarity(${SEARCH_EXPR_EVENTS}, $1) DESC,
      ("recurring" IS NULL) ASC,
      "date" ASC
    LIMIT $2 OFFSET $3
  `

  const eventsCountSql = `
    SELECT count(*)::text AS count
    FROM "events"
    WHERE ${eventsExpr} LIKE ${needleExpr}
  `

  const tasks: Array<Promise<unknown>> = []

  const postsListIdx = wantPosts ? tasks.length : -1
  if (wantPosts) tasks.push(pool.query<PostRow>(postsListSql, [q, limit, offset]))

  const postsCountIdx = wantPosts ? tasks.length : -1
  if (wantPosts) tasks.push(pool.query<CountRow>(postsCountSql, [q]))

  const eventsListIdx = wantEvents ? tasks.length : -1
  if (wantEvents) tasks.push(pool.query<EventRow>(eventsListSql, [q, limit, offset]))

  const eventsCountIdx = wantEvents ? tasks.length : -1
  if (wantEvents) tasks.push(pool.query<CountRow>(eventsCountSql, [q]))

  const settled = await Promise.all(tasks)

  let posts: PostSearchHit[] = []
  let events: EventSearchHit[] = []
  let total = 0

  if (wantPosts) {
    const listRes = settled[postsListIdx] as { rows: PostRow[] }
    const countRes = settled[postsCountIdx] as { rows: CountRow[] }
    posts = listRes.rows.map((row) => ({
      type: 'post' as const,
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category,
      serie: row.serie,
      author: row.author,
      date: row.date ?? '',
      snippet: buildPostSnippet(row, q),
      url: `/blog/${row.slug}`,
    }))
    total += Number(countRes.rows[0]?.count ?? '0')
  }

  if (wantEvents) {
    const listRes = settled[eventsListIdx] as { rows: EventRow[] }
    const countRes = settled[eventsCountIdx] as { rows: CountRow[] }
    events = listRes.rows.map((row) => ({
      type: 'event' as const,
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      location: row.location,
      recurring: row.recurring,
      snippet: buildEventSnippet(row, q),
      url: `/agenda`,
    }))
    total += Number(countRes.rows[0]?.count ?? '0')
  }

  return { posts, events, total }
}
