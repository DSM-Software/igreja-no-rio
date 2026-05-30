import { Icon } from '@iconify/react'
import { fmtDate } from '@/lib/utils'
import type { Download } from '@/payload-types'

const KIND_META: Record<string, { icon: string; label: string; cls: string }> = {
  audio:  { icon: 'material-symbols:headphones-rounded',      label: 'Áudio',  cls: 'download-icon-audio' },
  pdf:    { icon: 'material-symbols:picture-as-pdf-rounded',  label: 'PDF',    cls: 'download-icon-pdf' },
  slides: { icon: 'material-symbols:slideshow-rounded',       label: 'Slides', cls: 'download-icon-slides' },
}

interface DownloadCardProps {
  item: Download
}

export default function DownloadCard({ item }: DownloadCardProps) {
  const meta = KIND_META[item.kind] ?? KIND_META.audio
  const fileUrl =
    item.externalUrl ||
    (item.file && typeof item.file === 'object' ? (item.file as any)?.url : null)

  return (
    <div className="download-card">
      <div className={`download-icon ${meta.cls}`}>
        <Icon icon={meta.icon} />
      </div>

      <div className="download-info">
        <p className="download-title">{item.title}</p>
        <div className="download-meta">
          <span className={`tag tag-neutral`} style={{ fontSize: 11 }}>{meta.label}</span>
          {item.category && <span>{item.category}</span>}
          {item.speaker && (
            <>
              <span className="post-card-meta-dot" />
              <span>{item.speaker}</span>
            </>
          )}
          {item.size && (
            <>
              <span className="post-card-meta-dot" />
              <span>{item.size}</span>
            </>
          )}
          {item.date && (
            <>
              <span className="post-card-meta-dot" />
              <span>{fmtDate(item.date)}</span>
            </>
          )}
        </div>
        {item.desc && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
            {item.desc}
          </p>
        )}
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
          style={{ flexShrink: 0 }}
          download={!item.externalUrl}
        >
          <Icon icon="material-symbols:download-rounded" />
          Baixar
        </a>
      )}
    </div>
  )
}
