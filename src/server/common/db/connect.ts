import "server-only";

import mongoose from "mongoose";
import { debugLog } from "@/src/lib/debug";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI ?? process.env.DATABASE_URL;
  if (!uri) {
    throw new Error(
      "MONGODB_URI mancante. Formato: mongodb://127.0.0.1:27017/cinemaverse",
    );
  }
  return uri;
}

/** Singleton: in dev Next ricarica i moduli, senza cache apriresti troppe connessioni. */
export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) {
    debugLog(4, "Mongo", "Riuso connessione esistente");
    return cache.conn;
  }

  if (!cache.promise) {
    const uri = getMongoUri();
    debugLog(3, "Mongo", "Apertura connessione");
    cache.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then(async (instance) => {
        await import("./register-models");
        debugLog(3, "Mongo", "Connessione ok", {
          db: instance.connection.name,
        });
        return instance;
      })
      .catch((error) => {
        cache.promise = null;
        debugLog(1, "Mongo", "Connessione fallita", error);
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
