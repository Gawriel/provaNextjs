import type { FilterQuery } from "mongoose";
import { connectDb } from "@/src/server/common/db/connect";
import { parseObjectId } from "@/src/server/common/http/object-id";
import { PersonaModel, type PersonaDocument } from "./persona.model";
import type { PersonaWrite } from "@/src/types/persona";

export const personaRepository = {
  async findAll(filter: FilterQuery<PersonaDocument> = {}) {
    await connectDb();
    return PersonaModel.find(filter).sort({ nome: 1 }).lean();
  },

  async findById(id: string) {
    await connectDb();
    return PersonaModel.findById(parseObjectId(id, "personaId")).lean();
  },

  async create(payload: PersonaWrite) {
    await connectDb();
    const created = await PersonaModel.create(payload);
    return created.toObject();
  },

  async updateById(id: string, payload: PersonaWrite) {
    await connectDb();
    return PersonaModel.findByIdAndUpdate(
      parseObjectId(id, "personaId"),
      payload,
      { new: true, runValidators: true },
    ).lean();
  },

  async deleteById(id: string) {
    await connectDb();
    return PersonaModel.findByIdAndDelete(parseObjectId(id, "personaId"));
  },

  async countByIds(ids: string[]) {
    await connectDb();
    if (ids.length === 0) return 0;
    const unique = [...new Set(ids)];
    const objectIds = unique.map((id) => parseObjectId(id, "personaId"));
    return PersonaModel.countDocuments({
      _id: { $in: objectIds },
    } as FilterQuery<PersonaDocument>);
  },
};
