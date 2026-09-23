import { ApiError } from "@/src/server/common/http/errors";
import { hashPassword, verifyPassword } from "@/src/server/auth/password";
import { userRepository } from "./user.repository";

export const userService = {
    async register(body: unknown) {
        if (!body || typeof body !== "object") {
            throw new ApiError(400, "Body JSON non valido.");
        }

        const raw = body as {
            username?: unknown;
            email?: unknown;
            password?: unknown;
        };

        const username = String(raw.username ?? "");

        const email = String(raw.email ?? "")
            .trim()
            .toLowerCase();

        const password = String(raw.password ?? "");

        if (!username) {
            throw new ApiError(400, "Username obbligatorio.");
        }

        if (!email) {
            throw new ApiError(400, "Email obbligatoria.");
        }

        if (!password) {
            throw new ApiError(400, "Password obbligatoria.");
        }

        if (password.length < 8) {
            throw new ApiError(
                400,
                "La password deve contenere almeno 8 caratteri.",
            );
        }

        const existingMail = await userRepository.findByEmail(email);

        if (existingMail) {
            throw new ApiError(409, "Email già registrata.");
        }

        const existingUsername = await userRepository.findByUsername(username);

        if (existingUsername) {
            throw new ApiError(409, "Username già registrato.");
        }

        const passwordHash = await hashPassword(password);

        const user = await userRepository.create(
            username,
            email,
            passwordHash,
        );

        return {
            id: String(user._id),
            email: user.email,
        };
    },

    async login(body: unknown) {
        if (!body || typeof body !== "object") {
            throw new ApiError(400, "Body JSON non valido.");
        }

        const raw = body as {
            email?: unknown;
            password?: unknown;
        };

        const email = String(raw.email ?? "")
            .trim()
            .toLowerCase();

        const password = String(raw.password ?? "");

        if (!email) {
            throw new ApiError(400, "Email obbligatoria.");
        }

        if (!password) {
            throw new ApiError(400, "Password obbligatoria.");
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(401, "Credenziali non valide.");
        }

        const validPassword = await verifyPassword(
            password,
            user.passwordHash,
        );

        if (!validPassword) {
            throw new ApiError(401, "Credenziali non valide.");
        }

        return {
            id: String(user._id),
            username: user.username,
            email: user.email,
        };
    },

};