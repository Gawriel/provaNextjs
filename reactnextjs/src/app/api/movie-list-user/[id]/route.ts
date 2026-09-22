import { debugLog } from "@/src/lib/debug";
import type { IdRouteContext } from "@/src/server/common/http/route-context";
import {
  handleApiError,
  jsonOk,
} from "@/src/server/common/http/response";
import { getCurrentUser } from "@/src/server/auth/session";
import {
  addMovieToUserList,
  removeMovieFromUserList,
} from "@/src/server/modules/movie-list-user/movie-list-user.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: IdRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonOk(
        { error: "Utente non autenticato." },
        401,
      );
    }

    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return jsonOk(
        { error: "type obbligatorio." },
        400,
      );
    }

    return jsonOk(
      await addMovieToUserList(user.id, id, type),
      201,
    );
  } catch (error) {
    debugLog(
      1,
      "POST /api/movie-list-user/[id]",
      "Errore",
      error,
    );

    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  context: IdRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonOk(
        { error: "Utente non autenticato." },
        401,
      );
    }

    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return jsonOk(
        { error: "type obbligatorio." },
        400,
      );
    }

    await removeMovieFromUserList(
      user.id,
      id,
      type,
    );

    return jsonOk({
      movieId: id,
      type,
    });
  } catch (error) {
    debugLog(
      1,
      "DELETE /api/movie-list-user/[id]",
      "Errore",
      error,
    );

    return handleApiError(error);
  }
}