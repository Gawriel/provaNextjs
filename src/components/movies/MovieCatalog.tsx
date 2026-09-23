"use client";

import { useMovieCatalog } from "@/src/hooks/useMovieCatalog";

import { MovieCatalogFilters } from "./MovieCatalogFilters";
import { MovieCatalogToolbar } from "./MovieCatalogToolbar";
import { MovieCard } from "./MovieCard";

export function MovieCatalog() {
  const {
    movies,
    loading,
    loadingMore,
    error,
    hasNextPage,
    searchValue,
    setSearchValue,
    favoriteIds,
    watchlistIds,
    listFilter,
    setListFilter,
    loadMoreRef,
  } = useMovieCatalog();

  const filteredMovies = movies.filter((movie) => {
    const { favorite, watchlist } = listFilter;

    if (!favorite && !watchlist) {
      return true;
    }

    if (favorite && watchlist) {
      return (
        favoriteIds.has(movie.id) ||
        watchlistIds.has(movie.id)
      );
    }

    return favorite
      ? favoriteIds.has(movie.id)
      : watchlistIds.has(movie.id);
  });

  if (loading) {
    return (
      <p className="text-sm text-zinc-400">
        Caricamento film...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-400">
        {error}
      </p>
    );
  }

  return (
    <>
      <MovieCatalogToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <MovieCatalogFilters
        value={listFilter}
        onChange={setListFilter}
      />

      {filteredMovies.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">
          Nessun film trovato.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              listState={{
                favorite: favoriteIds.has(movie.id),
                watchlist: watchlistIds.has(movie.id),
              }}
            />
          ))}
        </div>
      )}

      <div
        ref={loadMoreRef}
        className="flex min-h-16 items-center justify-center"
      >
        {loadingMore && (
          <p className="text-sm text-zinc-500">
            Caricamento altri film...
          </p>
        )}

        {!loadingMore && !hasNextPage && movies.length > 0 && (
          <p className="text-sm text-zinc-600">
            Hai raggiunto la fine del catalogo.
          </p>
        )}
      </div>
    </>
  );
}