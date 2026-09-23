import { debugLog } from "@/src/lib/debug";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import { getMovies, postMovie } from "@/src/server/modules/movie/movie.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return jsonOk(await getMovies(searchParams));
  } catch (error) {
    debugLog(1, "GET /api/movies", "Errore", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    return jsonOk(await postMovie(await request.json()), 201);
  } catch (error) {
    debugLog(1, "POST /api/movies", "Errore", error);
    return handleApiError(error);
  }
}