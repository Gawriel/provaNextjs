import { debugLog } from "@/src/lib/debug";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import { getGeneri, postGenere } from "@/src/server/modules/genere/genere.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return jsonOk(await getGeneri());
  } catch (error) {
    debugLog(1, "GET /api/generi", "Errore", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    return jsonOk(await postGenere(await request.json()), 201);
  } catch (error) {
    debugLog(1, "POST /api/generi", "Errore", error);
    return handleApiError(error);
  }
}
