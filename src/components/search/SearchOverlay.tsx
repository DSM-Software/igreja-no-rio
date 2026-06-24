"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import SearchResults from "./SearchResults";
import { hitDomId } from "./SearchHit";
import { useSearch } from "./useSearch";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const VISIBLE_LIMIT = 5;

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  // Portal to document.body so the fixed backdrop isn't trapped inside the
  // header's containing block — the header uses `backdrop-blur`, and any CSS
  // backdrop-filter creates a new containing block for `position: fixed`
  // descendants, which would constrain `inset-0` to the header strip.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;
  return createPortal(<OverlayPanel onClose={onClose} />, document.body);
}

function OverlayPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { status, data, error } = useSearch(query, { limit: VISIBLE_LIMIT });

  const flattened = useMemo(() => {
    if (!data) return [] as { id: string; url: string }[];
    return [
      ...data.posts.map((p) => ({ id: hitDomId("post", p.id), url: p.url })),
      ...data.events.map((e) => ({ id: hitDomId("event", e.id), url: e.url })),
    ];
  }, [data]);

  // Reset active index when results identity changes. This is the React
  // "adjust state during render" idiom — calling setState in render bails
  // out and re-renders with the new state instead of cascading effects.
  const [trackedData, setTrackedData] = useState(data);
  if (trackedData !== data) {
    setTrackedData(data);
    setActiveIndex(0);
  }

  const hasResults = status === "success" && (data?.total ?? 0) > 0;
  const total = data?.total ?? 0;
  const visibleCount = (data?.posts.length ?? 0) + (data?.events.length ?? 0);
  const activeHit = flattened[activeIndex] ?? null;
  const activeId = activeHit?.id ?? null;

  // Focus input on mount, lock body scroll, restore focus on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handle = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(handle);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handlePanelClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handlePanelKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (flattened.length === 0) {
        if (e.key === "Enter" && query.trim().length >= 2) {
          e.preventDefault();
          router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
          onClose();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flattened.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + flattened.length) % flattened.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = flattened[activeIndex];
        if (target) {
          router.push(target.url);
          onClose();
        }
      }
    },
    [flattened, activeIndex, router, onClose, query],
  );

  const liveMessage =
    status === "loading"
      ? "Carregando resultados"
      : status === "success"
        ? total > 0
          ? `${total} resultados encontrados`
          : "Nenhum resultado"
        : "";

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy-900/60 backdrop-blur-sm"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no site"
        onClick={handlePanelClick}
        onKeyDown={handlePanelKeyDown}
        className="mx-4 mt-20 max-w-2xl rounded-card bg-white shadow-soft sm:mx-auto"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Icon
            icon="material-symbols:search-rounded"
            className="shrink-0 text-muted"
            style={{ fontSize: 22 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Buscar posts e eventos…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={hasResults}
            aria-controls="search-listbox"
            aria-autocomplete="list"
            aria-activedescendant={activeId || undefined}
            className="min-w-0 flex-1 bg-transparent font-body text-base text-ink outline-none placeholder:text-muted-2"
          />
          <kbd className="hidden rounded border border-border bg-bg px-1.5 py-0.5 font-body text-[11px] font-semibold text-muted sm:inline-block">
            esc para fechar
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink"
          >
            <Icon icon="material-symbols:close-rounded" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <ul
            id="search-listbox"
            role="listbox"
            aria-label="Resultados da busca"
            className="flex flex-col"
          >
            <SearchResults
              status={status}
              data={data}
              error={error}
              query={query.trim()}
              activeId={activeId}
              onHoverHit={(id) => {
                const idx = flattened.findIndex((h) => h.id === id);
                if (idx >= 0) setActiveIndex(idx);
              }}
              onClose={onClose}
            />
          </ul>
        </div>

        {hasResults && total > visibleCount && (
          <div className="border-t border-border px-4 py-3 text-sm">
            <Link
              href={`/busca?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 font-display font-semibold text-brand-700 hover:text-brand-600"
            >
              Ver todos os resultados de “{query.trim()}” →
            </Link>
          </div>
        )}

        <div aria-live="polite" className="sr-only">
          {liveMessage}
        </div>
      </div>
    </div>
  );
}

