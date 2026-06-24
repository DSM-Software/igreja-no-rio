"use client";

import { Icon } from "@iconify/react";

interface SearchTriggerProps {
  onLight?: boolean;
  onClick: () => void;
  className?: string;
}

export default function SearchTrigger({
  onLight = true,
  onClick,
  className,
}: SearchTriggerProps) {
  const base =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors";
  const variant = onLight
    ? "border-border bg-white text-ink hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar"
      title="Buscar (Ctrl/⌘ + K)"
      data-search-trigger
      className={`${base} ${variant}${className ? ` ${className}` : ""}`}
    >
      <Icon icon="material-symbols:search-rounded" />
    </button>
  );
}
