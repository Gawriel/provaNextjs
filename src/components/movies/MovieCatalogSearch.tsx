"use client";

import { useEffect, useState } from "react";

type MovieCatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MovieCatalogSearch({
  value,
  onChange,
}: MovieCatalogSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setOpen(true);
    }
  }, [value]);

  function toggleSearch() {
    setOpen((current) => !current);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleSearch}
        aria-label={open ? "Chiudi ricerca" : "Apri ricerca"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-200 ease-out
          ${open ? "w-64 opacity-100" : "w-0 opacity-0"}
        `}
      >
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cerca un film..."
          aria-label="Cerca un film"
          className="
            w-full rounded-lg border border-zinc-700
            bg-zinc-900 px-3 py-2 text-sm text-white
            outline-none transition-colors
            placeholder:text-zinc-500
            focus:border-zinc-500
          "
        />
      </div>
    </div>
  );
}