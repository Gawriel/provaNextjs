import type { QueryFilter } from "mongoose";
import { debugLog } from "@/src/lib/debug";
import { serializeDoc } from "@/src/server/common/db/serialize";
import { ApiError } from "@/src/server/common/http/errors";
import { parseObjectId } from "@/src/server/common/http/object-id";
import { genereService } from "@/src/server/modules/genere/genere.service";
import { personaService } from "@/src/server/modules/persona/persona.service";
import type { Movie as MovieDto, MovieWrite } from "@/src/types/movie";
import { movieRepository, type MovieRecord } from "./movie.repository";
import type { MovieDocument } from "./movie.model";

function asIdList(value: unknown, label: string): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new ApiError(400, `${label} deve essere un array di id.`);
  }
  return value.map((id, index) => {
    if (typeof id !== "string") {
      throw new ApiError(400, `${label}[${index}] deve essere una stringa.`);
    }
    parseObjectId(id, `${label}[${index}]`);
    return id;
  });
}

function parseMovie(body: unknown): MovieRecord {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Body JSON non valido.");
  }

  const raw = body as MovieWrite;
  const titolo = String(raw.titolo ?? "").trim();
  const anno = Number(raw.anno);
  const durata = Number(raw.durata);

  if (!titolo) throw new ApiError(400, "Titolo obbligatorio.");
  if (!Number.isInteger(anno) || anno < 1888 || anno > 2100) {
    throw new ApiError(400, "Anno non valido.");
  }
  if (!Number.isInteger(durata) || durata < 1) {
    throw new ApiError(400, "Durata non valida (minuti).");
  }

  return {
    titolo,
    descrizione: String(raw.descrizione ?? "").trim(),
    anno,
    durata,
    poster: String(raw.poster ?? "").trim(),
    trailer: String(raw.trailer ?? "").trim(),
    streaming: String(raw.streaming ?? "").trim(),
    generi: asIdList(raw.genereIds, "genereIds"),
    registi: asIdList(raw.registaIds, "registaIds"),
    attori: asIdList(raw.attoreIds, "attoreIds"),
  };
}

function movieFilter(searchParams: URLSearchParams): QueryFilter<MovieDocument> {
  const filter: QueryFilter<MovieDocument> = {};
  const q = searchParams.get("q")?.trim();
  const genereId = searchParams.get("genereId")?.trim();
  const anno = searchParams.get("anno");

  if (q) filter.titolo = { $regex: q, $options: "i" };
  if (genereId) filter.generi = parseObjectId(genereId, "genereId");
  if (anno) {
    const year = Number(anno);
    if (!Number.isInteger(year)) throw new ApiError(400, "Filtro anno non valido.");
    filter.anno = year;
  }

  return filter;
}

async function assertRelations(record: MovieRecord): Promise<void> {
  await Promise.all([
    genereService.assertIdsExist(record.generi),
    personaService.assertIdsExist([...record.registi, ...record.attori]),
  ]);
}

export const movieService = {
  async getMovies(searchParams: URLSearchParams): Promise<MovieDto[]> {
    const filter = movieFilter(searchParams);

    debugLog(4, "MovieService", "getMovies filter", filter);

    const rows = await movieRepository.findAll(filter);

    debugLog(3, "MovieService", "getMovies", {
      count: rows.length,
    });

    return serializeDoc(rows) as MovieDto[];
  },

  async getMovie(id: string): Promise<MovieDto> {
    const row = await movieRepository.findById(id);
    if (!row) throw new ApiError(404, "Film non trovato.");
    debugLog(3, "MovieService", "getMovie", { id });
    return serializeDoc(row) as MovieDto;
  },

  async createMovie(body: unknown): Promise<MovieDto> {
    const record = parseMovie(body);
    await assertRelations(record);
    const id = await movieRepository.create(record);
    debugLog(3, "MovieService", "createMovie", { id, titolo: record.titolo });
    return movieService.getMovie(id);
  },

  async updateMovie(id: string, body: unknown): Promise<MovieDto> {
    const record = parseMovie(body);
    await assertRelations(record);
    const updated = await movieRepository.updateById(id, record);
    if (!updated) throw new ApiError(404, "Film non trovato.");
    debugLog(3, "MovieService", "updateMovie", { id });
    return movieService.getMovie(id);
  },

  async deleteMovie(id: string): Promise<void> {
    const deleted = await movieRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, "Film non trovato.");
    debugLog(2, "MovieService", "deleteMovie", { id });
  },
};
