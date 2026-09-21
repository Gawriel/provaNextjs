import { debugLog } from "@/src/lib/debug";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import { getPersone, postPersona } from "@/src/server/modules/persona/persona.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const ruolo = new URL(request.url).searchParams.get("ruolo") ?? undefined;
    return jsonOk(await getPersone(ruolo));
  } catch (error) {
    debugLog(1, "GET /api/persone", "Errore", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    return jsonOk(await postPersona(await request.json()), 201);
  } catch (error) {
    debugLog(1, "POST /api/persone", "Errore", error);
    return handleApiError(error);
  }
}
