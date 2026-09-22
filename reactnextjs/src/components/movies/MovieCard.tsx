"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { Movie } from "@/src/types/movie";

type MovieListType = "favorite" | "watchlist";

type MovieListState = {
  favorite: boolean;
  watchlist: boolean;
};

type MovieCardProps = {
  movie: Movie;
  listState: MovieListState;
};

export function MovieCard({
  movie,
  listState,
}: MovieCardProps) {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);

  const [favorite, setFavorite] = useState(
    listState.favorite,
  );

  const [watchlist, setWatchlist] = useState(
    listState.watchlist,
  );

  const [loadingType, setLoadingType] =
    useState<MovieListType | null>(null);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  const generi =
    movie.generi.map((g) => g.nome).join(" · ") ||
    "Senza genere";

  const registi =
    movie.registi.map((p) => p.nome).join(", ") ||
    "Regista n/d";

  const attori =
    movie.attori.map((p) => p.nome).join(", ") ||
    "Cast n/d";

  function handleMouseEnter() {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setIsExpanded(true);
    }, 400);
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

    const isActive =
      type === "favorite" ? favorite : watchlist;

    try {
      setLoadingType(type);

      const method = isActive ? "DELETE" : "POST";

      const response = await fetch(
        `/api/movie-list-user/${movie.id}?type=${type}`,
        {
          method,
        },
      );

      const payload = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error ??
          "Impossibile modificare la lista.",
        );
      }

      if (type === "favorite") {
        setFavorite(!isActive);
      } else {
        setWatchlist(!isActive);
      }
    } catch (error) {
      console.error(
        "Errore durante la modifica della lista:",
        error,
      );
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        overflow-hidden rounded-xl
        border border-zinc-200 bg-white shadow-sm
        transition-transform duration-400 ease-out
        dark:border-zinc-800 dark:bg-zinc-950
        ${isExpanded
          ? "scale-[1.04] shadow-xl"
          : "scale-100"
        }
      `}
    >
      <div className="relative">
        <Link
          href={`/film/${movie.id}`}
          className="block p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {generi}
          </p>

          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {movie.titolo}{" "}
            <span className="font-normal text-zinc-500">
              ({movie.anno})
            </span>
          </h2>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {movie.durata} min · {registi}
          </p>

          <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {movie.descrizione || "Nessuna descrizione."}
          </p>

          <p className="text-xs text-zinc-500">
            Cast: {attori}
          </p>
        </Link>

        {/* Stato delle liste sempre visibile */}
        {(favorite || watchlist) && (
          <div className="pointer-events-none absolute right-3 top-3 flex gap-1.5">
            {favorite && (
              <span
                className="
          flex h-7 min-w-7 items-center justify-center
          rounded-full bg-black/75 px-1.5
          text-sm text-white shadow-sm
          backdrop-blur-sm
        "
                aria-label="Film tra i preferiti"
              >
                ♥
              </span>
            )}

            {watchlist && (
              <span
                className="
          flex h-7 min-w-7 items-center justify-center
          rounded-full bg-black/75 px-1.5
          text-sm font-semibold text-white shadow-sm
          backdrop-blur-sm
        "
                aria-label="Film nella lista da vedere"
              >
                +
              </span>
            )}
          </div>
        )}
      </div>

      {/* Barra azioni */}
      <div
        className={`
          flex items-center justify-end gap-2
          overflow-hidden bg-black px-4
          transition-[max-height,padding,opacity]
          duration-400 ease-out
          ${isExpanded
            ? "max-h-16 py-2 opacity-100"
            : "max-h-0 py-0 opacity-0"
          }
        `}
      >
        {/* Preferiti */}
        <button
          type="button"
          disabled={loadingType !== null}
          onClick={() => void toggleList("favorite")}
          className={`
            group/action relative flex h-8 w-8
            items-center justify-center
            rounded-full
            transition
            hover:bg-white/15
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${favorite
              ? "text-red-500"
              : "text-white"
            }
          `}
          aria-label={
            favorite
              ? "Rimuovi dai preferiti"
              : "Aggiungi ai preferiti"
          }
        >
          <span aria-hidden="true">
            {favorite ? "♥" : "♡"}
          </span>

          <span
            className="
              pointer-events-none absolute bottom-full right-0 mb-2
              whitespace-nowrap rounded bg-black px-2 py-1
              text-xs text-white opacity-0 shadow-md
              transition-opacity
              group-hover/action:opacity-100
            "
          >
            {favorite
              ? "Rimuovi dai preferiti"
              : "Aggiungi ai preferiti"}
          </span>
        </button>

        {/* Watchlist */}
        <button
          type="button"
          disabled={loadingType !== null}
          onClick={() => void toggleList("watchlist")}
          className={`
            group/action relative flex h-8 w-8
            items-center justify-center
            rounded-full
            transition
            hover:bg-white/15
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${watchlist
              ? "bg-white text-black"
              : "text-white"
            }
          `}
          aria-label={
            watchlist
              ? "Rimuovi dalla lista da vedere"
              : "Aggiungi alla lista da vedere"
          }
        >
          <span aria-hidden="true">+</span>

          <span
            className="
              pointer-events-none absolute bottom-full right-0 mb-2
              whitespace-nowrap rounded bg-black px-2 py-1
              text-xs text-white opacity-0 shadow-md
              transition-opacity
              group-hover/action:opacity-100
            "
          >
            {watchlist
              ? "Rimuovi dalla lista da vedere"
              : "Aggiungi alla lista da vedere"}
          </span>
        </button>
      </div>
    </article>
  );
}