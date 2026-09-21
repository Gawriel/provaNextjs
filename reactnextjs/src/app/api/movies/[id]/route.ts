import { debugLog } from "@/src/lib/debug";
import type { IdRouteContext } from "@/src/server/common/http/route-context";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import {
  deleteMovie,
  getMovie,
  putMovie,
} from "@/src/server/modules/movie/movie.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await getMovie(id));
  } catch (error) {
    debugLog(1, "GET /api/movies/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await putMovie(id, await request.json()));
  } catch (error) {
    debugLog(1, "PUT /api/movies/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    await deleteMovie(id);
    return jsonOk({ id });
  } catch (error) {
    debugLog(1, "DELETE /api/movies/[id]", "Errore", error);
    return handleApiError(error);
  }
}
