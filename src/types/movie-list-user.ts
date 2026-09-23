import type { Movie } from "./movie";

export type MovieListUserType = "favorite" | "watchlist";

export type MovieListUser = {
  id: string;
  movieId: string;
  type: MovieListUserType;
  createdAt: string;
  updatedAt: string;
};
