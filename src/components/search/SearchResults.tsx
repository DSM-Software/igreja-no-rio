"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import SearchResultGroup from "./SearchResultGroup";
import { PostHit, EventHit, hitDomId } from "./SearchHit";
import type {
  PostSearchHit,
  EventSearchHit,
  SearchResults as SearchResultsData,
  SearchStatus,
} from "./useSearch";

interface SearchResultsProps {
  status: SearchStatus;
  data: SearchResultsData | null;
  error: Error | null;
  query: string;
  activeId: string | null;
  onHoverHit: (id: string) => void;
  onClose: () => void;
  onRetry?: () => void;
}

export default function SearchResults({
  status,
  data,
  query,
  activeId,
  onHoverHit,
  onClose,
  onRetry,
}: SearchResultsProps) {
  if (status === "idle") {
    return (
      <div className="px-6 py-10 text-center text-sm text-muted">
        Digite ao menos 2 letras para buscar
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-10 text-sm text-muted">
        <Icon
          icon="material-symbols:progress-activity"
          className="animate-spin"
        />
        <span>Buscando…</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-4 my-6 rounded-soft border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Não foi possível buscar agora.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center rounded-full border border-red-300 bg-white px-3 py-1 font-display text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  // success
  if (!data || data.total === 0) {
    return (
      <div className="px-6 py-10 text-center text-sm text-ink-2">
        <p>
          Nada encontrado para{" "}
          <span className="font-semibold text-ink">“{query}”</span>.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/blog"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-full border border-border bg-white px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            Ver todos os posts
          </Link>
          <Link
            href="/agenda"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-full border border-border bg-white px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            Ver a agenda
          </Link>
        </div>
      </div>
    );
  }

  const renderPost = (hit: PostSearchHit) => {
    const id = hitDomId("post", hit.id);
    return (
      <PostHit
        key={id}
        hit={hit}
        isActive={activeId === id}
        onMouseEnter={() => onHoverHit(id)}
        onSelect={onClose}
      />
    );
  };

  const renderEvent = (hit: EventSearchHit) => {
    const id = hitDomId("event", hit.id);
    return (
      <EventHit
        key={id}
        hit={hit}
        isActive={activeId === id}
        onMouseEnter={() => onHoverHit(id)}
        onSelect={onClose}
      />
    );
  };

  return (
    <>
      {data.posts.length > 0 && (
        <SearchResultGroup label="Posts">
          {data.posts.map(renderPost)}
        </SearchResultGroup>
      )}
      {data.events.length > 0 && (
        <SearchResultGroup label="Eventos">
          {data.events.map(renderEvent)}
        </SearchResultGroup>
      )}
    </>
  );
}
