import Link from "next/link";

import type { Movie } from "@/src/types/movie";
import { fetchApi } from "@/src/lib/api-client";

type FilmDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

async function getMovie(id: string): Promise<Movie> {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/movies/${id}`, {
        cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok || !payload.ok) {
        throw new Error(
            payload.ok === false
                ? payload.error
                : "Impossibile caricare il film.",
        );
    }

    return payload.data;
}

export default async function FilmDetailPage({
    params,
}: FilmDetailPageProps) {
    const { id } = await params;

    let movie: Movie;

    try {
        movie = await getMovie(id);
        console.log("MOVIE DETAIL:", movie);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Impossibile caricare il film.";

        return (
            <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-3 py-10">
                <Link
                    href="/film"
                    className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                >
                    ← Torna ai film
                </Link>

                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
                    {message}
                </div>
            </main>
        );
    }

    const generi =
        movie.generi.map((genere) => genere.nome).join(" · ") ||
        "Senza genere";

    const registi =
        movie.registi.map((persona) => persona.nome).join(", ") ||
        "Regista n/d";

    const attori =
        movie.attori.map((persona) => persona.nome).join(", ") ||
        "Cast n/d";

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <Link
                href="/film"
                className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            >
                ← Torna ai film
            </Link>

            <section className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
                {/* Locandina */}
                <div className="aspect-2/3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={`Locandina di ${movie.titolo}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                            Nessuna locandina
                        </div>
                    )}
                </div>

                {/* Informazioni */}
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                            {generi}
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {movie.titolo}
                        </h1>

                        <p className="mt-2 text-zinc-500">
                            {movie.anno} · {movie.durata} min
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            Descrizione
                        </h2>

                        <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                            {movie.descrizione || "Nessuna descrizione disponibile."}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            Regia
                        </h2>

                        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            {registi}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            Cast
                        </h2>

                        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            {attori}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}