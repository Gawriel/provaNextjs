import type { QueryFilter } from "mongoose";

import { connectDb } from "@/src/server/common/db/connect";
import { parseObjectId } from "@/src/server/common/http/object-id";
import {
  MovieListUserModel,
  type MovieListUserDocument,
  type MovieListUserType,
} from "./movie-list-user.model";

export const movieListUserRepository = {
  async findByUser(
    userId: string,
    type?: MovieListUserType,
  ) {
    await connectDb();

    const filter: QueryFilter<MovieListUserDocument> = {
      userId: parseObjectId(userId, "userId"),
    };

    if (type) {
      filter.type = type;
    }

    return MovieListUserModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
  },

  async findOne(
    userId: string,
    movieId: string,
    type: MovieListUserType,
  ) {
    await connectDb();

    return MovieListUserModel.findOne({
      userId: parseObjectId(userId, "userId"),
      movieId: parseObjectId(movieId, "movieId"),
      type,
    }).lean();
  },

  async create(
    userId: string,
    movieId: string,
    type: MovieListUserType,
  ) {
    await connectDb();

    return MovieListUserModel.create({
      userId: parseObjectId(userId, "userId"),
      movieId: parseObjectId(movieId, "movieId"),
      type,
    });
  },

  async delete(
    userId: string,
    movieId: string,
    type: MovieListUserType,
  ) {
    await connectDb();

    return MovieListUserModel.findOneAndDelete({
      userId: parseObjectId(userId, "userId"),
      movieId: parseObjectId(movieId, "movieId"),
      type,
    });
  },
};