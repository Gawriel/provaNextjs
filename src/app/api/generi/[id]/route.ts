import { debugLog } from "@/src/lib/debug";
import type { IdRouteContext } from "@/src/server/common/http/route-context";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import {
  deleteGenere,
  getGenere,
  putGenere,
} from "@/src/server/modules/genere/genere.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await getGenere(id));
  } catch (error) {
    debugLog(1, "GET /api/generi/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await putGenere(id, await request.json()));
  } catch (error) {
    debugLog(1, "PUT /api/generi/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    await deleteGenere(id);
    return jsonOk({ id });
  } catch (error) {
    debugLog(1, "DELETE /api/generi/[id]", "Errore", error);
    return handleApiError(error);
  }
}
