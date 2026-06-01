'use client'

import { useState } from 'react'
import DownloadCard from './DownloadCard'
import type { Download } from '@/payload-types'

const INITIAL_LIMIT = 6

interface DownloadCategorySectionProps {
  title: string
  items: Download[]
  id: string
}

export default function DownloadCategorySection({ title, items, id }: DownloadCategorySectionProps) {
  const [expanded, setExpanded] = useState(false)

  const visible = expanded ? items : items.slice(0, INITIAL_LIMIT)
  const hiddenCount = items.length - INITIAL_LIMIT

  return (
    <section id={id} className="downloads-category-section">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {title}
        <span
          style={{
            marginInlineStart: 8,
            fontWeight: 400,
            fontSize: 14,
            color: 'var(--muted)',
          }}
        >
          ({items.length})
        </span>
      </h2>

      <div className="downloads-list">
        {visible.map((dl) => (
          <DownloadCard key={dl.id} item={dl} />
        ))}
      </div>

      {hiddenCount > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 16 }}
        >
          Ver mais ({hiddenCount} restantes)
        </button>
      )}
    </section>
  )
}
