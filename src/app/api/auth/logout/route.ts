import { cookies } from "next/headers";

import {
  handleApiError,
  jsonOk,
} from "@/src/server/common/http/response";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return jsonOk({
      message: "Logout effettuato.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
