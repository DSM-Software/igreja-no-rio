import { Icon } from "@iconify/react";
import { fmtDate, getSafeExternalURL } from "@/lib/utils";
import type { Download } from "@/payload-types";

const KIND_META: Record<string, { icon: string; label: string; cls: string }> =
  {
    audio: {
      icon: "material-symbols:headphones-rounded",
      label: "Áudio",
      cls: "download-icon-audio",
    },
    pdf: {
      icon: "material-symbols:picture-as-pdf-rounded",
      label: "PDF",
      cls: "download-icon-pdf",
    },
    slides: {
      icon: "material-symbols:slideshow-rounded",
      label: "Slides",
      cls: "download-icon-slides",
    },
  };

interface DownloadCardProps {
  item: Download;
}

export default function DownloadCard({ item }: DownloadCardProps) {
  const meta = KIND_META[item.kind] ?? KIND_META.audio;
  const safeExternalURL = getSafeExternalURL(item.externalUrl);
  const fileUrl =
    safeExternalURL ||
    (item.file && typeof item.file === "object"
      ? (item.file as any)?.url
      : null);

  return (
    <div className="flex flex-wrap gap-4 rounded-card border border-border bg-white p-4 shadow-soft md:flex-nowrap md:items-center">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-soft text-xl ${
          item.kind === "pdf"
            ? "bg-rose-50 text-rose-600"
            : item.kind === "slides"
              ? "bg-violet-50 text-violet-600"
              : "bg-brand-50 text-brand-700"
        }`}
      >
        <Icon icon={meta.icon} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-semibold text-ink">
          {item.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            {meta.label}
          </span>
          {item.category && <span>{item.category}</span>}
          {item.speaker && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{item.speaker}</span>
            </>
          )}
          {item.size && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{item.size}</span>
            </>
          )}
          {item.date && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{fmtDate(item.date)}</span>
            </>
          )}
        </div>
        {item.desc && (
          <p className="mt-1 text-sm leading-6 text-muted">{item.desc}</p>
        )}
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-border px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          download={!safeExternalURL}
        >
          <Icon icon="material-symbols:download-rounded" />
          Baixar
        </a>
      )}
    </div>
  );
}
