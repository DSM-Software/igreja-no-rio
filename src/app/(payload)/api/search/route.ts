import { runSearch } from '@/lib/search'

export const dynamic = 'force-dynamic'

function parseType(raw: string | null): 'all' | 'posts' | 'events' {
  if (raw === 'posts' || raw === 'events' || raw === 'all') return raw
  return 'all'
}

function parseInteger(raw: string | null, fallback: number): number {
  if (!raw) return fallback
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : fallback
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    const type = parseType(url.searchParams.get('type'))

    const rawLimit = parseInteger(url.searchParams.get('limit'), 5)
    const limit = Math.max(1, Math.min(50, rawLimit))

    const rawOffset = parseInteger(url.searchParams.get('offset'), 0)
    const offset = Math.max(0, rawOffset)

    const results = await runSearch({ q, type, limit, offset })

    return Response.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (err) {
    console.error('[search] failed', err)
    return Response.json({ error: 'search_failed' }, { status: 500 })
  }
}
