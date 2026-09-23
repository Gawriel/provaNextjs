"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchApi } from "@/src/lib/api-client";
import type { Genere } from "@/src/types/genere";

export function GenreFilter() {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<Genere[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGenreId = searchParams.get("genereId");

  useEffect(() => {
    fetchApi<Genere[]>("/api/generi")
      .then((data) => {
        setGenres(
          data.filter(
            (genere) =>
              genere.nome.toLowerCase() !== "nessun genere",
          ),
        );
      })
      .catch(() => {
        setGenres([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function selectGenre(genereId: string | null) {
    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());

    params.delete("q");

    if (genereId) {
      params.set("genereId", genereId);
    } else {
      params.delete("genereId");
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `/film?${query}` : "/film");
  }

  const selectedGenre = genres.find(
    (genere) => genere.id === selectedGenreId,
  );

  return (
    <section className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 text-lg font-semibold text-white"
      >
        <span>
          Generi{selectedGenre ? `: ${selectedGenre.nome}` : ""}
        </span>

        <span aria-hidden="true">
          {open ? "↑" : "↓"}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 w-fit max-w-[90vw] rounded-xl bg-black/90 p-5 shadow-2xl backdrop-blur-md">
          {loading ? (
            <p className="text-sm text-white">
              Caricamento generi…
            </p>
          ) : genres.length === 0 ? (
            <p className="text-sm text-white">
              Nessun genere disponibile.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
              <button
                type="button"
                onClick={() => selectGenre(null)}
                className={`
                  rounded-md px-3 py-1.5 text-left text-sm
                  text-white transition-colors duration-150
                  hover:bg-white hover:text-black
                  ${!selectedGenreId ? "font-semibold" : ""}
                `}
              >
                Tutti
              </button>

              {genres.map((genere) => (
                <button
                  key={genere.id}
                  type="button"
                  onClick={() => selectGenre(genere.id)}
                  className={`
                    rounded-md px-3 py-1.5 text-left text-sm
                    text-white transition-colors duration-150
                    hover:bg-white hover:text-black
                    ${
                      genere.id === selectedGenreId
                        ? "font-semibold"
                        : ""
                    }
                  `}
                >
                  {genere.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}