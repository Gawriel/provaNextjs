"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Movie } from "@/src/types/movie";
import type { MovieListUser } from "@/src/types/movie-list-user";

const PAGE_SIZE = 40;
const SEARCH_DEBOUNCE = 650;
const MIN_LOADING_TIME = 300;

type MovieCatalogListFilter = {
  favorite: boolean;
  watchlist: boolean;
};

type MoviesResponse = {
  movies: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export function useMovieCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());

  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [listFilter, setListFilter] = useState<MovieCatalogListFilter>({
    favorite: false,
    watchlist: false,
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [page, setPage] = useState(1);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);

  const query = searchParams.get("q") ?? "";
  const genereId = searchParams.get("genereId") ?? "";

  const loadMovies = useCallback(
    async (pageToLoad: number, append: boolean) => {
      if (append && loadingMoreRef.current) {
        return;
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const startedAt = Date.now();

      try {
        if (append) {
          loadingMoreRef.current = true;
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const params = new URLSearchParams();

        params.set("page", String(pageToLoad));
        params.set("limit", String(PAGE_SIZE));

        if (query) {
          params.set("q", query);
        }

        if (genereId) {
          params.set("genereId", genereId);
        }

        const response = await fetch(`/api/movies?${params.toString()}`, {
          signal: controller.signal,
        });

        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(
            payload.error ?? "Impossibile caricare i film.",
          );
        }

        const data = payload.data as MoviesResponse;

        const elapsed = Date.now() - startedAt;
        const remaining = MIN_LOADING_TIME - elapsed;

        if (remaining > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, remaining),
          );
        }

        if (controller.signal.aborted) {
          return;
        }

        setMovies((current) =>
          append ? [...current, ...data.movies] : data.movies,
        );

        setHasNextPage(data.pagination.hasNextPage);
        setPage(data.pagination.page);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Errore durante il caricamento dei film:",
          error,
        );

        setError("Impossibile caricare i film.");
      } finally {
        if (append) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [query, genereId],
  );

  const loadUserLists = useCallback(async () => {
    try {
      const response = await fetch("/api/movie-list-user");

      if (!response.ok) {
        return;
      }

      const payload = await response.json();

      if (!payload.ok) {
        return;
      }

      const lists = payload.data as MovieListUser[];

      const favorite = new Set<string>();
      const watchlist = new Set<string>();

      for (const item of lists) {
        if (item.type === "favorite") {
          favorite.add(item.movieId);
        }

        if (item.type === "watchlist") {
          watchlist.add(item.movieId);
        }
      }

      setFavoriteIds(favorite);
      setWatchlistIds(watchlist);
    } catch (error) {
      console.error(
        "Errore durante il caricamento delle liste:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    void loadUserLists();
  }, [loadUserLists]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasNextPage(false);
    loadingMoreRef.current = false;

    void loadMovies(1, false);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [query, genereId, loadMovies]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchValue.trim();
      const currentQuery = searchParams.get("q") ?? "";

      if (value === currentQuery) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("q", value);
        params.delete("genereId");
      } else {
        params.delete("q");
      }

      params.delete("page");

      const queryString = params.toString();

      router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
      );
    }, SEARCH_DEBOUNCE);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchValue, pathname, router, searchParams]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return;
        }

        if (loadingMoreRef.current) {
          return;
        }

        const nextPage = page + 1;

        void loadMovies(nextPage, true);
      },
      {
        rootMargin: "600px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [page, hasNextPage, loadMovies]);

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasNextPage,

    searchValue,
    setSearchValue,

    favoriteIds,
    watchlistIds,

    listFilter,
    setListFilter,

    loadMoreRef,
  };
}