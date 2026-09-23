import { debugLog } from "@/src/lib/debug";
import { movieService } from "./movie.service";

export async function getMovies(searchParams: URLSearchParams) {
  debugLog(4, "MovieController", "getMovies");
  return movieService.getMovies(searchParams);
}

export async function postMovie(body: unknown) {
  debugLog(4, "MovieController", "postMovie");
  return movieService.createMovie(body);
}

export async function getMovie(id: string) {
  debugLog(4, "MovieController", "getMovie", { id });
  return movieService.getMovie(id);
}

export async function putMovie(id: string, body: unknown) {
  debugLog(4, "MovieController", "putMovie", { id });
  return movieService.updateMovie(id, body);
}

export async function deleteMovie(id: string) {
  debugLog(4, "MovieController", "deleteMovie", { id });
  return movieService.deleteMovie(id);
}
