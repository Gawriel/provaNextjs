import { cookies } from "next/headers";

import { verifyToken } from "@/src/server/auth/jwt";
import { userRepository } from "@/src/server/modules/user/user.repository";
import { CurrentUser } from "@/src/types/user";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    if (typeof payload.userId !== "string") {
      return null;
    }

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      return null;
    }

    return {
      id: String(user._id),
      username: user.username,
      email: user.email,
    };
  } catch {
    return null;
  }
}