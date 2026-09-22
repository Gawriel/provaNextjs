"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Movie } from "@/src/types/movie";
import type { MovieListUser } from "@/src/types/movie-list-user";

import { MovieCard } from "./MovieCard";

async function fetchUserMovieLists(): Promise<MovieListUser[]> {
  const response = await fetch("/api/movie-list-user");

  if (response.status === 401) {
    return [];
  }

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.error ??
        "Impossibile recuperare le liste utente.",
    );
  }

  return payload.data as MovieListUser[];
}

export function MovieCatalog() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(),
  );

  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(
    new Set(),
  );

  const searchParams = useSearchParams();
  const genereId = searchParams.get("genereId");

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const path = genereId
          ? `/api/movies?genereId=${encodeURIComponent(genereId)}`
          : "/api/movies";

        const response = await fetch(path);

        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(
            payload.error ??
              "Impossibile recuperare i film.",
          );
        }

        setMovies(payload.data);
      } catch (error) {
        console.error(
          "Errore durante il recupero dei film:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Errore durante il recupero dei film.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMovies();
  }, [genereId]);

  useEffect(() => {
    async function loadUserLists() {
      try {
        const lists = await fetchUserMovieLists();

        setFavoriteIds(
          new Set(
            lists
              .filter((item) => item.type === "favorite")
              .map((item) => item.movieId),
          ),
        );

        setWatchlistIds(
          new Set(
            lists
              .filter((item) => item.type === "watchlist")
              .map((item) => item.movieId),
          ),
        );
      } catch (error) {
        console.error(
          "Errore durante il recupero delle liste utente:",
          error,
        );
      }
    }

    void loadUserLists();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Caricamento film...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (movies.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nessun film trovato.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          listState={{
            favorite: favoriteIds.has(movie.id),
            watchlist: watchlistIds.has(movie.id),
          }}
        />
      ))}
    </div>
  );
}