import { debugLog } from "@/src/lib/debug";
import {
  handleApiError,
  jsonOk,
} from "@/src/server/common/http/response";
import { getCurrentUser } from "@/src/server/auth/session";
import { getUserMovieList } from "@/src/server/modules/movie-list-user/movie-list-user.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonOk(
        { error: "Utente non autenticato." },
        401,
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? undefined;

    return jsonOk(
      await getUserMovieList(user.id, type),
    );
  } catch (error) {
    debugLog(1, "GET /api/movie-list-user", "Errore", error);

    return handleApiError(error);
  }
}