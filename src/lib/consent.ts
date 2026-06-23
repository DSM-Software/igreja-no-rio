export type ConsentCategory = 'analytics' | 'marketing'

export type ConsentCategories = {
  analytics: boolean
  marketing: boolean
}

export type ConsentState = {
  version: 1
  decidedAt: string
  categories: ConsentCategories
}

export const CONSENT_STORAGE_KEY = 'ir:consent:v1'
export const CONSENT_TTL_MS = 12 * 30 * 24 * 60 * 60 * 1000
const SAME_TAB_EVENT = 'ir:consent:changed'

const sameTabEmitter: EventTarget | null =
  typeof window === 'undefined' ? null : new EventTarget()

function parseStored(raw: string | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    if (parsed?.version !== 1) return null
    if (typeof parsed.decidedAt !== 'string') return null
    const categories = parsed.categories
    if (
      !categories ||
      typeof categories.analytics !== 'boolean' ||
      typeof categories.marketing !== 'boolean'
    ) {
      return null
    }
    return {
      version: 1,
      decidedAt: parsed.decidedAt,
      categories: {
        analytics: categories.analytics,
        marketing: categories.marketing,
      },
    }
  } catch {
    return null
  }
}

export function isConsentValid(state: ConsentState | null): state is ConsentState {
  if (!state) return false
  const decidedAt = Date.parse(state.decidedAt)
  if (Number.isNaN(decidedAt)) return false
  return Date.now() - decidedAt < CONSENT_TTL_MS
}

let cachedRaw: string | null | undefined = undefined
let cachedState: ConsentState | null = null

function invalidateCache() {
  cachedRaw = undefined
  cachedState = null
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    const parsed = parseStored(raw)
    cachedState = isConsentValid(parsed) ? parsed : null
  }
  return cachedState
}

export function writeConsent(categories: ConsentCategories): ConsentState | null {
  if (typeof window === 'undefined') return null
  const state: ConsentState = {
    version: 1,
    decidedAt: new Date().toISOString(),
    categories: {
      analytics: !!categories.analytics,
      marketing: !!categories.marketing,
    },
  }
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state))
  invalidateCache()
  sameTabEmitter?.dispatchEvent(new Event(SAME_TAB_EVENT))
  return state
}

export function resetConsent(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  invalidateCache()
  sameTabEmitter?.dispatchEvent(new Event(SAME_TAB_EVENT))
}

export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const storageHandler = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      invalidateCache()
      callback()
    }
  }
  const sameTabHandler = () => callback()

  window.addEventListener('storage', storageHandler)
  sameTabEmitter?.addEventListener(SAME_TAB_EVENT, sameTabHandler)

  return () => {
    window.removeEventListener('storage', storageHandler)
    sameTabEmitter?.removeEventListener(SAME_TAB_EVENT, sameTabHandler)
  }
}

export function hasConsent(state: ConsentState | null, category: ConsentCategory): boolean {
  if (!isConsentValid(state)) return false
  return state.categories[category] === true
}
