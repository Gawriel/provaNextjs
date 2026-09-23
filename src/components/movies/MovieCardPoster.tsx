import Link from "next/link";

import type { Movie } from "@/src/types/movie";

type MovieCardPosterProps = {
  movie: Movie;
  favorite: boolean;
  watchlist: boolean;
  expanded: boolean;
};

export function MovieCardPoster({
  movie,
  favorite,
  watchlist,
  expanded,
}: MovieCardPosterProps) {
  const generi =
    movie.generi.map((genere) => genere.nome).join(" · ") || "Senza genere";

  return (
    <Link href={`/film/${movie.id}`} className="block">
      <div className="relative aspect-9/5 overflow-hidden bg-zinc-900">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`Locandina di ${movie.titolo}`}
            className={`
              h-full w-full object-cover
              transition-transform duration-500 ease-out
              ${expanded ? "scale-105" : "scale-100"}
            `}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 px-6 text-center text-sm text-zinc-500">
            Nessuna locandina
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/70 to-transparent" />

        {(favorite || watchlist) && (
          <div className="pointer-events-none absolute right-3 top-3 flex gap-1.5">
            {favorite && (
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-black/75 px-2 text-sm text-red-400 shadow-lg backdrop-blur-sm">
                ♥
              </span>
            )}

            {watchlist && (
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-black/75 px-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                +
              </span>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-400">
            {generi}
          </p>

          <h2 className="text-xl font-semibold leading-tight text-white">
            {movie.titolo}
          </h2>
        </div>
      </div>
    </Link>
  );
}