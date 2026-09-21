import type { FilterQuery } from "mongoose";
import { connectDb } from "@/src/server/common/db/connect";
import { parseObjectId } from "@/src/server/common/http/object-id";
import { MovieModel, type MovieDocument } from "./movie.model";

const POPULATE = [
  { path: "generi", select: "nome" },
  { path: "registi", select: "nome bio foto ruoli" },
  { path: "attori", select: "nome bio foto ruoli" },
] as const;

export type MovieRecord = {
  titolo: string;
  descrizione: string;
  anno: number;
  durata: number;
  poster: string;
  trailer: string;
  streaming: string;
  generi: string[];
  registi: string[];
  attori: string[];
};

export const movieRepository = {
  async findAll(filter: FilterQuery<MovieDocument>) {
    await connectDb();
    return MovieModel.find(filter)
      .populate([...POPULATE])
      .sort({ anno: -1, titolo: 1 })
      .lean();
  },

  async findById(id: string) {
    await connectDb();
    return MovieModel.findById(parseObjectId(id, "movieId"))
      .populate([...POPULATE])
      .lean();
  },

  async create(payload: MovieRecord) {
    await connectDb();
    const created = await MovieModel.create({
      ...payload,
      generi: payload.generi.map((id) => parseObjectId(id, "genereId")),
      registi: payload.registi.map((id) => parseObjectId(id, "registaId")),
      attori: payload.attori.map((id) => parseObjectId(id, "attoreId")),
    });
    return String(created._id);
  },

  async updateById(id: string, payload: MovieRecord) {
    await connectDb();
    return MovieModel.findByIdAndUpdate(
      parseObjectId(id, "movieId"),
      {
        ...payload,
        generi: payload.generi.map((ref) => parseObjectId(ref, "genereId")),
        registi: payload.registi.map((ref) => parseObjectId(ref, "registaId")),
        attori: payload.attori.map((ref) => parseObjectId(ref, "attoreId")),
      },
      { new: true, runValidators: true },
    );
  },

  async deleteById(id: string) {
    await connectDb();
    return MovieModel.findByIdAndDelete(parseObjectId(id, "movieId"));
  },
};
