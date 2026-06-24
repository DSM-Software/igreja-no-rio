"use client";

import type { ReactNode } from "react";

interface SearchResultGroupProps {
  label: string;
  children: ReactNode;
}

export default function SearchResultGroup({
  label,
  children,
}: SearchResultGroupProps) {
  return (
    <li role="presentation" className="px-2 py-2">
      <h3 className="px-3 pb-1 font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
        {label}
      </h3>
      <ul role="presentation" className="flex flex-col gap-0.5">
        {children}
      </ul>
    </li>
  );
}
