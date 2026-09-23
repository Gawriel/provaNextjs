import type { QueryFilter } from "mongoose";
import { connectDb } from "@/src/server/common/db/connect";
import { parseObjectId } from "@/src/server/common/http/object-id";
import { GenereModel, type GenereDocument } from "./genere.model";

export const genereRepository = {
  async findAll() {
    await connectDb();
    return GenereModel.find().sort({ nome: 1 }).lean();
  },

  async findById(id: string) {
    await connectDb();
    return GenereModel.findById(parseObjectId(id, "genereId")).lean();
  },

  async create(nome: string) {
    await connectDb();
    const created = await GenereModel.create({ nome });
    return created.toObject();
  },

  async updateById(id: string, nome: string) {
    await connectDb();
    return GenereModel.findByIdAndUpdate(
      parseObjectId(id, "genereId"),
      { nome },
      { new: true, runValidators: true },
    ).lean();
  },

  async deleteById(id: string) {
    await connectDb();
    return GenereModel.findByIdAndDelete(parseObjectId(id, "genereId"));
  },

  async countByIds(ids: string[]) {
    await connectDb();
    if (ids.length === 0) return 0;
    const objectIds = ids.map((id) => parseObjectId(id, "genereId"));
    return GenereModel.countDocuments({
      _id: { $in: objectIds },
    } as QueryFilter<GenereDocument>);
  },
};
