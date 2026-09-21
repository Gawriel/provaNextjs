import type { Movie } from "@/src/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const generi = movie.generi.map((g) => g.nome).join(" · ") || "Senza genere";
  const registi = movie.registi.map((p) => p.nome).join(", ") || "Regista n/d";
  const attori = movie.attori.map((p) => p.nome).join(", ") || "Cast n/d";

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {generi}
      </p>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {movie.titolo}{" "}
        <span className="font-normal text-zinc-500">({movie.anno})</span>
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {movie.durata} min · {registi}
      </p>
      <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {movie.descrizione || "Nessuna descrizione."}
      </p>
      <p className="text-xs text-zinc-500">Cast: {attori}</p>
    </article>
  );
}
