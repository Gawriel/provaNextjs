import { debugLog } from "@/src/lib/debug";
import type { IdRouteContext } from "@/src/server/common/http/route-context";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import {
  deletePersona,
  getPersona,
  putPersona,
} from "@/src/server/modules/persona/persona.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await getPersona(id));
  } catch (error) {
    debugLog(1, "GET /api/persone/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    return jsonOk(await putPersona(id, await request.json()));
  } catch (error) {
    debugLog(1, "PUT /api/persone/[id]", "Errore", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: IdRouteContext) {
  try {
    const { id } = await context.params;
    await deletePersona(id);
    return jsonOk({ id });
  } catch (error) {
    debugLog(1, "DELETE /api/persone/[id]", "Errore", error);
    return handleApiError(error);
  }
}
