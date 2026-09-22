import { MovieCatalog } from "@/src/components/movies/MovieCatalog";
import { GenreFilter } from "@/src/components/movies/GenreFilter";

export const metadata = {
  title: "Film",
};

export default function FilmPage() {
  return (
    <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-3 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Film
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Catalogo letto da MongoDB tramite le API REST <code>/api/movies</code>.
        </p>
      </div>
      <GenreFilter />
      <MovieCatalog />
    </main>
  );
}
