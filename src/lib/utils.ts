const MONTHS_FULL = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]
const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function fmtDate(iso: string | null | undefined, full = false): string {
  if (!iso) return ''
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso)
  if (isNaN(d.getTime())) return iso ?? ''
  const m = full ? MONTHS_FULL[d.getMonth()] : MONTHS_SHORT[d.getMonth()]
  return `${d.getDate()} de ${m}${full ? ' de ' + d.getFullYear() : ''}`
}

export function readingTime(body: unknown): number {
  const text = typeof body === 'string' ? body : JSON.stringify(body ?? '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.round(words / 200))
}

export function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export function getSafeExternalURL(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    const parsedURL = new URL(value)

    if (parsedURL.protocol !== 'https:' && parsedURL.protocol !== 'http:') {
      return null
    }

    return parsedURL.toString()
  } catch {
    return null
  }
}
