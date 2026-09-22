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
            (genere) => genere.nome.toLowerCase() !== "nessun genere",
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
    const params = new URLSearchParams(searchParams.toString());

    if (genereId) {
      params.set("genereId", genereId);
    } else {
      params.delete("genereId");
    }

    const query = params.toString();

    router.push(query ? `/film?${query}` : "/film");
  }

  const selectedGenre = genres.find(
    (genere) => genere.id === selectedGenreId,
  );

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
      >
        <span>
          Generi
          {selectedGenre ? `: ${selectedGenre.nome}` : ""}
        </span>

        <span aria-hidden="true">{open ? "↑" : "↓"}</span>
      </button>

      {open && (
        <div className="mt-3 rounded-lg bg-black p-4">
          {loading ? (
            <p className="text-sm text-white">Caricamento generi…</p>
          ) : genres.length === 0 ? (
            <p className="text-sm text-white">
              Nessun genere disponibile.
            </p>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={() => selectGenre(null)}
                className={`text-sm text-white transition-opacity hover:opacity-70 ${
                  !selectedGenreId ? "font-bold" : ""
                }`}
              >
                Tutti
              </button>

              {genres.map((genere) => (
                <button
                  key={genere.id}
                  type="button"
                  onClick={() => selectGenre(genere.id)}
                  className={`text-sm text-white transition-opacity hover:opacity-70 ${
                    genere.id === selectedGenreId ? "font-bold" : ""
                  }`}
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