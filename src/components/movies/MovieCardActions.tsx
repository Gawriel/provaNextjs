"use client";

type MovieCardActionsProps = {
  favorite: boolean;
  watchlist: boolean;
  loading: boolean;
  onToggleFavorite: () => void;
  onToggleWatchlist: () => void;
};

export function MovieCardActions({
  favorite,
  watchlist,
  loading,
  onToggleFavorite,
  onToggleWatchlist,
}: MovieCardActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleFavorite();
        }}
        className={`
          flex h-8 w-8 items-center justify-center rounded-full
          transition-colors duration-200 hover:bg-white/10
          disabled:cursor-not-allowed disabled:opacity-50
          ${favorite ? "text-red-400" : "text-zinc-400 hover:text-white"}
        `}
        aria-label={
          favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
        }
      >
        <span aria-hidden="true" className="text-lg">
          {favorite ? "♥" : "♡"}
        </span>
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleWatchlist();
        }}
        className={`
          flex h-8 w-8 items-center justify-center rounded-full
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50
          ${
            watchlist
              ? "bg-white text-zinc-950"
              : "text-zinc-400 hover:bg-white/10 hover:text-white"
          }
        `}
        aria-label={
          watchlist
            ? "Rimuovi dalla lista da vedere"
            : "Aggiungi alla lista da vedere"
        }
      >
        <span aria-hidden="true" className="text-lg">
          +
        </span>
      </button>
    </div>
  );
}