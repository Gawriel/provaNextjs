import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import { registerUser } from "@/src/server/modules/user/user.controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await registerUser(body);

    return jsonOk(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}