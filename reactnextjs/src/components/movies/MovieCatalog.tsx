"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/lib/api-client";
import { debugLog } from "@/src/lib/debug";
import type { Movie } from "@/src/types/movie";
import { MovieCard } from "./MovieCard";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; movies: Movie[] };

export function MovieCatalog() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    debugLog(3, "MovieCatalog", "Fetch /api/movies");

    fetchApi<Movie[]>("/api/movies")
      .then((movies) => {
        if (cancelled) return;
        debugLog(4, "MovieCatalog", "Film ricevuti", { count: movies.length });
        setState({ status: "ok", movies });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Impossibile caricare i film.";
        debugLog(1, "MovieCatalog", "Fetch fallita", message);
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <p className="text-sm text-zinc-500">Caricamento catalogo…</p>;
  }

  if (state.status === "error") {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {state.message} Controlla che MongoDB sia avviato e che MONGODB_URI sia in
        .env.local.
      </p>
    );
  }

  if (state.movies.length === 0) {
    return (
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Nessun film in database. Crea prima generi e persone, poi un film via
        API (vedi riepilogo-progetto.txt).
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {state.movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
