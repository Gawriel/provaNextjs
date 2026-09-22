import mongoose from "mongoose";

function isObjectId(value: unknown): value is mongoose.Types.ObjectId {
  return value instanceof mongoose.Types.ObjectId;
}

/** Converte i documenti Mongo (_id) nel formato frontend (id). */

export function serializeDoc(value: unknown): unknown {
  return transform(value);
}
// export function serializeDoc<T>(value: T): T {
//   return transform(value) as T;
// }

function transform(value: unknown): unknown {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(transform);
  if (value instanceof Date) return value.toISOString();
  if (isObjectId(value)) return value.toHexString();

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    if ("_id" in record) {
      out.id = transform(record._id);
    }

    for (const [key, nested] of Object.entries(record)) {
      if (key === "_id" || key === "__v") continue;
      out[key] = transform(nested);
    }

    return out;
  }

  return value;
}
