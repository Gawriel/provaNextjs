import { debugLog } from "@/src/lib/debug";
import { serializeDoc } from "@/src/server/common/db/serialize";
import { ApiError } from "@/src/server/common/http/errors";
import type { Persona as PersonaDto, PersonaWrite, RuoloPersona } from "@/src/types/persona";
import { personaRepository } from "./persona.repository";

const RUOLI: RuoloPersona[] = ["attore", "regista"];

function parsePersona(body: unknown): PersonaWrite {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Body JSON non valido.");
  }

  const raw = body as PersonaWrite;
  const nome = String(raw.nome ?? "").trim();
  if (nome.length < 2) {
    throw new ApiError(400, "Il nome deve avere almeno 2 caratteri.");
  }

  const ruoli = Array.isArray(raw.ruoli)
    ? raw.ruoli.filter((ruolo): ruolo is RuoloPersona =>
        RUOLI.includes(ruolo as RuoloPersona),
      )
    : [];

  return {
    nome,
    bio: String(raw.bio ?? "").trim(),
    foto: String(raw.foto ?? "").trim(),
    ruoli,
  };
}

export const personaService = {
  async getPersone(ruolo?: string): Promise<PersonaDto[]> {
    const filter =
      ruolo === "attore" || ruolo === "regista" ? { ruoli: ruolo } : {};
    const rows = await personaRepository.findAll(filter);
    debugLog(3, "PersonaService", "getPersone", {
      count: rows.length,
      ruolo: ruolo ?? "tutti",
    });
    return serializeDoc(rows) as PersonaDto[];
  },

  async getPersona(id: string): Promise<PersonaDto> {
    const row = await personaRepository.findById(id);
    if (!row) throw new ApiError(404, "Persona non trovata.");
    return serializeDoc(row) as PersonaDto;
  },

  async createPersona(body: unknown): Promise<PersonaDto> {
    const payload = parsePersona(body);
    const created = await personaRepository.create(payload);
    debugLog(3, "PersonaService", "createPersona", { nome: payload.nome });
    return serializeDoc(created) as PersonaDto;
  },

  async updatePersona(id: string, body: unknown): Promise<PersonaDto> {
    const payload = parsePersona(body);
    const updated = await personaRepository.updateById(id, payload);
    if (!updated) throw new ApiError(404, "Persona non trovata.");
    debugLog(3, "PersonaService", "updatePersona", { id });
    return serializeDoc(updated) as PersonaDto;
  },

  async deletePersona(id: string): Promise<void> {
    const deleted = await personaRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, "Persona non trovata.");
    debugLog(2, "PersonaService", "deletePersona", { id });
  },

  async assertIdsExist(ids: string[]): Promise<void> {
    const unique = [...new Set(ids)];
    if (unique.length === 0) return;
    const count = await personaRepository.countByIds(unique);
    if (count !== unique.length) {
      throw new ApiError(
        400,
        "Uno o più attori/registi non esistono. Creali prima in /api/persone.",
      );
    }
  },
};
