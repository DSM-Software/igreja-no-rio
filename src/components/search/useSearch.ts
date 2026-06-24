"use client";

import { useEffect, useReducer, useRef } from "react";

export type PostSearchHit = {
  type: "post";
  id: number;
  title: string;
  slug: string;
  category: "Devocional" | "Estudo";
  serie: string | null;
  author: string;
  date: string;
  snippet: string;
  url: string;
};

export type EventSearchHit = {
  type: "event";
  id: number;
  title: string;
  date: string | null;
  time: string | null;
  location: string | null;
  recurring: string | null;
  snippet: string;
  url: string;
};

export type SearchResults = {
  posts: PostSearchHit[];
  events: EventSearchHit[];
  total: number;
};

export type SearchStatus = "idle" | "loading" | "success" | "error";

export type UseSearchOptions = {
  minLength?: number;
  debounceMs?: number;
  limit?: number;
};

export type UseSearchResult = {
  status: SearchStatus;
  data: SearchResults | null;
  error: Error | null;
};

const EMPTY_RESULTS: SearchResults = { posts: [], events: [], total: 0 };

type State = {
  status: SearchStatus;
  data: SearchResults | null;
  error: Error | null;
};

type Action =
  | { type: "reset" }
  | { type: "loading" }
  | { type: "success"; data: SearchResults }
  | { type: "error"; error: Error };

const IDLE_STATE: State = {
  status: "idle",
  data: EMPTY_RESULTS,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return IDLE_STATE;
    case "loading":
      return { status: "loading", data: state.data, error: null };
    case "success":
      return { status: "success", data: action.data, error: null };
    case "error":
      return { status: "error", data: null, error: action.error };
  }
}

export function useSearch(
  query: string,
  opts?: UseSearchOptions,
): UseSearchResult {
  const minLength = opts?.minLength ?? 2;
  const debounceMs = opts?.debounceMs ?? 250;
  const limit = opts?.limit ?? 5;

  const trimmed = query.trim();
  const tooShort = trimmed.length < minLength;

  const [state, dispatch] = useReducer(reducer, IDLE_STATE);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (tooShort) {
      abortRef.current?.abort();
      abortRef.current = null;
      dispatch({ type: "reset" });
      return;
    }

    const handle = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ type: "loading" });

      const url = `/api/search?q=${encodeURIComponent(trimmed)}&type=all&limit=${limit}`;

      fetch(url, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("search_failed");
          }
          const json = (await response.json()) as SearchResults;
          if (controller.signal.aborted) return;
          dispatch({ type: "success", data: json });
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          if (controller.signal.aborted) return;
          dispatch({
            type: "error",
            error: err instanceof Error ? err : new Error("search_failed"),
          });
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(handle);
    };
  }, [trimmed, tooShort, debounceMs, limit]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return state;
}
