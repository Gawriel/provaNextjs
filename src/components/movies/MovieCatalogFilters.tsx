"use client";

export type MovieCatalogListFilter = {
  favorite: boolean;
  watchlist: boolean;
};

type MovieCatalogFiltersProps = {
  value: MovieCatalogListFilter;
  onChange: (value: MovieCatalogListFilter) => void;
};

export function MovieCatalogFilters({
  value,
  onChange,
}: MovieCatalogFiltersProps) {
  function toggleFilter(type: keyof MovieCatalogListFilter) {
    onChange({
      ...value,
      [type]: !value[type],
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => toggleFilter("favorite")}
        className={`
          rounded-full border px-4 py-2 text-sm font-medium
          transition-colors duration-200
          ${
            value.favorite
              ? "border-amber-400 bg-amber-400 text-zinc-950"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-white"
          }
        `}
      >
        ♥ Preferiti
      </button>

      <button
        type="button"
        onClick={() => toggleFilter("watchlist")}
        className={`
          rounded-full border px-4 py-2 text-sm font-medium
          transition-colors duration-200
          ${
            value.watchlist
              ? "border-amber-400 bg-amber-400 text-zinc-950"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-white"
          }
        `}
      >
        + Da vedere
      </button>
    </div>
  );
}