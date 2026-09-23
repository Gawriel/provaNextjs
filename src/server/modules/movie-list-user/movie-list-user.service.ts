import { ApiError } from "@/src/server/common/http/errors";
import { parseObjectId } from "@/src/server/common/http/object-id";
import {
    movieListUserRepository,
} from "./movie-list-user.repository";
import type { MovieListUserType } from "@/src/types/movie-list-user";

const TYPES: MovieListUserType[] = ["favorite", "watchlist"];

function parseType(value: unknown): MovieListUserType {
    if (
        typeof value !== "string" ||
        !TYPES.includes(value as MovieListUserType)
    ) {
        throw new ApiError(
            400,
            "Tipo lista non valido. Usa 'favorite' oppure 'watchlist'.",
        );
    }

    return value as MovieListUserType;
}

export const movieListUserService = {
    async getUserList(
        userId: string,
        type?: string,
    ) {
        parseObjectId(userId, "userId");

        const parsedType = type ? parseType(type) : undefined;

        const documents = await movieListUserRepository.findByUser(
            userId,
            parsedType,
        );

        return documents.map((document) => ({
            id: document._id.toString(),
            movieId: document.movieId.toString(),
            type: document.type,
            createdAt: document.createdAt.toISOString(),
            updatedAt: document.updatedAt.toISOString(),
        }));
    },

    async add(
        userId: string,
        movieId: string,
        type: unknown,
    ) {
        parseObjectId(userId, "userId");
        parseObjectId(movieId, "movieId");

        const parsedType = parseType(type);

        const existing = await movieListUserRepository.findOne(
            userId,
            movieId,
            parsedType,
        );

        if (existing) {
            throw new ApiError(
                409,
                "Il film è già presente nella lista.",
            );
        }

        return movieListUserRepository.create(
            userId,
            movieId,
            parsedType,
        );
    },

    async remove(
        userId: string,
        movieId: string,
        type: unknown,
    ) {
        parseObjectId(userId, "userId");
        parseObjectId(movieId, "movieId");

        const parsedType = parseType(type);

        const deleted = await movieListUserRepository.delete(
            userId,
            movieId,
            parsedType,
        );

        if (!deleted) {
            throw new ApiError(
                404,
                "Il film non è presente nella lista.",
            );
        }
    },
};