import { cookies } from "next/headers";
import { createToken } from "@/src/server/auth/jwt";
import { handleApiError, jsonOk } from "@/src/server/common/http/response";
import { loginUser } from "@/src/server/modules/user/user.controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const user = await loginUser(body);

        const token = await createToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        const cookieStore = await cookies();

        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            //senza maxAge il cookie si toglie quando chiudo il browser
            maxAge: 60 * 60 * 24 * 1,
            path: "/",
        });

        return jsonOk(user);
    } catch (error) {
        return handleApiError(error);
    }
}