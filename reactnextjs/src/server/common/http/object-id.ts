import mongoose from "mongoose";
import { ApiError } from "./errors";

export function parseObjectId(id: string, label = "id"): mongoose.Types.ObjectId {
  const valid =
    mongoose.Types.ObjectId.isValid(id) &&
    String(new mongoose.Types.ObjectId(id)) === id;

  if (!valid) {
    throw new ApiError(400, `${label} non valido.`);
  }

  return new mongoose.Types.ObjectId(id);
}

export function parseObjectIdList(
  ids: unknown,
  label: string,
): mongoose.Types.ObjectId[] {
  if (ids == null) return [];
  if (!Array.isArray(ids)) {
    throw new ApiError(400, `${label} deve essere un array di id.`);
  }

  return ids.map((id, index) => {
    if (typeof id !== "string") {
      throw new ApiError(400, `${label}[${index}] deve essere una stringa.`);
    }
    return parseObjectId(id, `${label}[${index}]`);
  });
}
