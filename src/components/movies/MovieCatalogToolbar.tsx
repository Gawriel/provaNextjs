"use client";

import { GenreFilter } from "./GenreFilter";
import { MovieCatalogSearch } from "./MovieCatalogSearch";

type MovieCatalogToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function MovieCatalogToolbar({
  searchValue,
  onSearchChange,
}: MovieCatalogToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <GenreFilter />

      <MovieCatalogSearch
        value={searchValue}
        onChange={onSearchChange}
      />
    </div>
  );
}