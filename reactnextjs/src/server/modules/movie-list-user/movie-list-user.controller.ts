import { debugLog } from "@/src/lib/debug";

import { movieListUserService } from "./movie-list-user.service";

export async function getUserMovieList(
  userId: string,
  type?: string,
) {
  debugLog(
    4,
    "MovieListUserController",
    "getUserMovieList",
    { userId, type },
  );

  return movieListUserService.getUserList(userId, type);
}

export async function addMovieToUserList(
  userId: string,
  movieId: string,
  type: unknown,
) {
  debugLog(
    4,
    "MovieListUserController",
    "addMovieToUserList",
    { userId, movieId, type },
  );

  return movieListUserService.add(
    userId,
    movieId,
    type,
  );
}

export async function removeMovieFromUserList(
  userId: string,
  movieId: string,
  type: unknown,
) {
  debugLog(
    4,
    "MovieListUserController",
    "removeMovieFromUserList",
    { userId, movieId, type },
  );

  return movieListUserService.remove(
    userId,
    movieId,
    type,
  );
}