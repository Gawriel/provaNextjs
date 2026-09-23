import { serializeDoc } from "@/src/server/common/db/serialize";
import { ApiError } from "@/src/server/common/http/errors";
import { debugLog } from "@/src/lib/debug";
import type { Genere as GenereDto, GenereWrite } from "@/src/types/genere";
import { genereRepository } from "./genere.repository";

function parseNome(body: unknown): string {
  if (!body || typeof body !== "object" || !("nome" in body)) {
    throw new ApiError(400, "Campo nome obbligatorio.");
  }
  const nome = String((body as GenereWrite).nome ?? "").trim();
  if (nome.length < 2) {
    throw new ApiError(400, "Il nome del genere deve avere almeno 2 caratteri.");
  }
  return nome;
}

export const genereService = {
  async getGeneri(): Promise<GenereDto[]> {
    const rows = await genereRepository.findAll();
    debugLog(3, "GenereService", "getGeneri", { count: rows.length });
    return serializeDoc(rows) as GenereDto[];
  },

  async getGenere(id: string): Promise<GenereDto> {
    const row = await genereRepository.findById(id);
    if (!row) throw new ApiError(404, "Genere non trovato.");
    debugLog(3, "GenereService", "getGenere", { id });
    return serializeDoc(row) as GenereDto;
  },

  async createGenere(body: unknown): Promise<GenereDto> {
    const nome = parseNome(body);
    const created = await genereRepository.create(nome);
    debugLog(3, "GenereService", "createGenere", { nome });
    return serializeDoc(created) as GenereDto;
  },

  async updateGenere(id: string, body: unknown): Promise<GenereDto> {
    const nome = parseNome(body);
    const updated = await genereRepository.updateById(id, nome);
    if (!updated) throw new ApiError(404, "Genere non trovato.");
    debugLog(3, "GenereService", "updateGenere", { id });
    return serializeDoc(updated) as GenereDto;
  },

  async deleteGenere(id: string): Promise<void> {
    const deleted = await genereRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, "Genere non trovato.");
    debugLog(2, "GenereService", "deleteGenere", { id });
  },

  async assertIdsExist(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const count = await genereRepository.countByIds(ids);
    if (count !== ids.length) {
      throw new ApiError(400, "Uno o più generi non esistono. Creali prima in /api/generi.");
    }
  },
};
