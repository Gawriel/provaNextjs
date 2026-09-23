"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/src/types/movie";
import { MovieCardActions } from "./MovieCardActions";
import { MovieCardPoster } from "./MovieCardPoster";

type MovieListType = "favorite" | "watchlist";

type MovieListState = {
  favorite: boolean;
  watchlist: boolean;
};

type MovieCardPosition = "left" | "center" | "right";

type MovieCardProps = {
  movie: Movie;
  listState: MovieListState;
  position?: MovieCardPosition;
};

export function MovieCard({
  movie,
  listState,
  position = "center",
}: MovieCardProps) {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [favorite, setFavorite] = useState(listState.favorite);
  const [watchlist, setWatchlist] = useState(listState.watchlist);
  const [loadingType, setLoadingType] = useState<MovieListType | null>(null);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFavorite(listState.favorite);
    setWatchlist(listState.watchlist);
  }, [listState.favorite, listState.watchlist]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const registi =
    movie.registi.map((persona) => persona.nome).join(", ") || "Regista n/d";

  function handleMouseEnter() {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setIsExpanded(true);
    }, 150);
  }

  function handleMouseLeave() {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    setIsExpanded(false);
  }

  async function toggleList(type: MovieListType) {
    if (loadingType) {
      return;
    }

    const isActive = type === "favorite" ? favorite : watchlist;

    try {
      setLoadingType(type);

      const method = isActive ? "DELETE" : "POST";
      const response = await fetch(
        `/api/movie-list-user/${movie.id}?type=${type}`,
        { method },
      );

      const payload = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error ?? "Impossibile modificare la lista.",
        );
      }

      if (type === "favorite") {
        setFavorite(!isActive);
      } else {
        setWatchlist(!isActive);
      }
    } catch (error) {
      console.error("Errore durante la modifica della lista:", error);
    } finally {
      setLoadingType(null);
    }
  }

  const expandedPosition =
    position === "left"
      ? "left-0"
      : position === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative aspect-9/5 w-full">
      <article
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          absolute top-0 rounded-xl border border-zinc-700/70
          bg-zinc-950 shadow-lg shadow-black/20
          transition-all duration-300 ease-out
          ${
            isExpanded
              ? `${expandedPosition} z-50 w-[112%] shadow-2xl shadow-black/70`
              : "left-0 z-0 w-full"
          }
        `}
      >
        <div className="overflow-hidden rounded-xl">
          <MovieCardPoster
            movie={movie}
            favorite={favorite}
            watchlist={watchlist}
            expanded={isExpanded}
          />

          <div
            className={`
              overflow-hidden transition-[max-height,opacity,padding]
              duration-300 ease-out
              ${
                isExpanded
                  ? "max-h-32 px-4 pb-3 pt-3 opacity-100"
                  : "max-h-0 px-4 py-0 opacity-0"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-300">
                {movie.anno} · {movie.durata} min
              </p>

              <MovieCardActions
                favorite={favorite}
                watchlist={watchlist}
                loading={loadingType !== null}
                onToggleFavorite={() => void toggleList("favorite")}
                onToggleWatchlist={() => void toggleList("watchlist")}
              />
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              <span className="text-zinc-400">Regia:</span> {registi}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}