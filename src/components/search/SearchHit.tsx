"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { fmtDate } from "@/lib/utils";
import type { PostSearchHit, EventSearchHit } from "./useSearch";

export function hitDomId(type: "post" | "event", id: number): string {
  return `search-hit-${type}-${id}`;
}

interface CommonProps {
  isActive: boolean;
  onMouseEnter: () => void;
  onSelect: () => void;
}

interface PostHitProps extends CommonProps {
  hit: PostSearchHit;
}

export function PostHit({ hit, isActive, onMouseEnter, onSelect }: PostHitProps) {
  const liRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isActive && liRef.current) {
      liRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <li
      ref={liRef}
      id={hitDomId("post", hit.id)}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onMouseEnter}
      className={`rounded-soft transition-colors ${isActive ? "bg-brand-50" : ""}`}
    >
      <Link
        href={hit.url}
        onClick={onSelect}
        className="block px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
            {hit.category}
          </span>
          {hit.serie && (
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              {hit.serie}
            </span>
          )}
        </div>
        <h4 className="mt-1 font-display text-sm font-bold leading-snug text-ink">
          {hit.title}
        </h4>
        {hit.snippet && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-2">
            {hit.snippet}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted">
          <span>{hit.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{fmtDate(hit.date)}</span>
        </div>
      </Link>
    </li>
  );
}

interface EventHitProps extends CommonProps {
  hit: EventSearchHit;
}

export function EventHit({ hit, isActive, onMouseEnter, onSelect }: EventHitProps) {
  const liRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isActive && liRef.current) {
      liRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <li
      ref={liRef}
      id={hitDomId("event", hit.id)}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onMouseEnter}
      className={`rounded-soft transition-colors ${isActive ? "bg-brand-50" : ""}`}
    >
      <Link
        href={hit.url}
        onClick={onSelect}
        className="block px-3 py-2.5"
      >
        <h4 className="font-display text-sm font-bold leading-snug text-ink">
          {hit.title}
        </h4>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-2">
          {hit.date && (
            <span className="inline-flex items-center gap-1">
              <Icon icon="material-symbols:event-outline-rounded" />
              {fmtDate(hit.date)}
              {hit.time ? ` · ${hit.time}` : ""}
            </span>
          )}
          {hit.recurring && (
            <span className="inline-flex items-center gap-1">
              <Icon icon="material-symbols:schedule-outline-rounded" />
              {hit.recurring}
            </span>
          )}
          {hit.location && (
            <span className="inline-flex items-center gap-1">
              <Icon icon="material-symbols:location-on-outline-rounded" />
              {hit.location}
            </span>
          )}
        </div>
        {hit.snippet && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-2">
            {hit.snippet}
          </p>
        )}
      </Link>
    </li>
  );
}
