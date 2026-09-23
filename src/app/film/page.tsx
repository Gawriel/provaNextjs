import { MovieCatalog } from "@/src/components/movies/MovieCatalog";
import { GenreFilter } from "@/src/components/movies/GenreFilter";

export const metadata = {
  title: "Film",
};

export default function FilmPage() {
  return (
    <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-3 py-10">
      <div className="flex flex-col gap-2">

      </div>
      <MovieCatalog />
    </main>
  );
}
