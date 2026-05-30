'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface BlogFiltersProps {
  categories: string[]
  series: string[]
  activeCategory?: string
  activeSerie?: string
}

export default function BlogFilters({ categories, series, activeCategory, activeSerie }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
      <div className="filter-bar">
        <button
          className={`filter-btn ${!activeCategory ? 'active' : ''}`}
          onClick={() => setFilter('category', null)}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setFilter('category', activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {series.length > 0 && (
        <div className="filter-bar">
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', paddingInline: 4, alignSelf: 'center' }}>
            SÉRIES:
          </span>
          {series.map((s) => (
            <button
              key={s}
              className={`filter-btn ${activeSerie === s ? 'active' : ''}`}
              onClick={() => setFilter('serie', activeSerie === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
