import path from "node:path";

import { loadEnvConfig } from "@next/env";

import { connectDb } from "@/src/server/common/db/mongoose-client";

import {
  importGenres,
  importMovies,
  importMovieRelations,
  importPeople,
  type MovieRelations,
} from "./imdb-importer";

import {
  parseNameBasicsRow,
  parseTitleBasicsRow,
  parseTitleCrewRow,
  parseTitlePrincipalsRow,
  readTsvFile,
  type ImdbName,
  type ImdbTitle,
} from "./imdb-parser";

import {
  addImportError,
  createImportStats,
  finishImportStats,
} from "./import-stats";

import { logImportResult } from "./import-logger";


loadEnvConfig(process.cwd());

const DATA_DIRECTORY = path.join(process.cwd(), "data");

// null = importa tutti i film disponibili
const MAX_MOVIES: number | null = 100;

const NAME_BASICS_FILE = path.join(
  DATA_DIRECTORY,
  "name.basics.tsv",
);

const TITLE_BASICS_FILE = path.join(
  DATA_DIRECTORY,
  "title.basics.tsv",
);

const TITLE_CREW_FILE = path.join(
  DATA_DIRECTORY,
  "title.crew.tsv",
);

const TITLE_PRINCIPALS_FILE = path.join(
  DATA_DIRECTORY,
  "title.principals.tsv",
);

async function selectMovies(): Promise<ImdbTitle[]> {
  const movies: ImdbTitle[] = [];

  await readTsvFile(TITLE_BASICS_FILE, (line) => {
    const movie = parseTitleBasicsRow(line);

    if (!movie) {
      return;
    }

    if (movie.titleType !== "movie") {
      return;
    }

    if (movie.isAdult) {
      return;
    }

    if (
      movie.startYear === null ||
      movie.runtimeMinutes === null
    ) {
      return;
    }

    movies.push(movie);

    if (
      MAX_MOVIES !== null &&
      movies.length >= MAX_MOVIES
    ) {
      return true;
    }

    return false;
  });

  return movies;
}

async function collectMovieRelations(
  movies: ImdbTitle[],
): Promise<Map<string, MovieRelations>> {
  const movieIds = new Set(
    movies.map((movie) => movie.tconst),
  );

  const relations = new Map<string, MovieRelations>();

  for (const movie of movies) {
    relations.set(movie.tconst, {
      directors: new Set(),
      actors: new Set(),
    });
  }

  await readTsvFile(TITLE_CREW_FILE, (line) => {
    const crew = parseTitleCrewRow(line);

    if (!crew) {
      return;
    }

    if (!movieIds.has(crew.tconst)) {
      return;
    }

    const relation = relations.get(crew.tconst);

    if (!relation) {
      return;
    }

    for (const director of crew.directors) {
      relation.directors.add(director);
    }

    return false;
  });

  await readTsvFile(TITLE_PRINCIPALS_FILE, (line) => {
    const principal = parseTitlePrincipalsRow(line);

    if (!principal) {
      return;
    }

    if (!movieIds.has(principal.tconst)) {
      return;
    }

    if (
      principal.category !== "actor" &&
      principal.category !== "actress"
    ) {
      return;
    }

    const relation = relations.get(principal.tconst);

    if (!relation) {
      return;
    }

    relation.actors.add(principal.nconst);

    return false;
  });

  return relations;
}

function collectPersonIds(
  relations: Map<string, MovieRelations>,
): Set<string> {
  const personIds = new Set<string>();

  for (const relation of relations.values()) {
    for (const director of relation.directors) {
      personIds.add(director);
    }

    for (const actor of relation.actors) {
      personIds.add(actor);
    }
  }

  return personIds;
}

async function selectPeople(
  personIds: Set<string>,
): Promise<Map<string, ImdbName>> {
  const people = new Map<string, ImdbName>();

  if (personIds.size === 0) {
    return people;
  }

  await readTsvFile(NAME_BASICS_FILE, (line) => {
    const person = parseNameBasicsRow(line);

    if (!person) {
      return;
    }

    if (!personIds.has(person.nconst)) {
      return;
    }

    people.set(person.nconst, person);

    if (people.size >= personIds.size) {
      return true;
    }

    return false;
  });

  return people;
}

async function main(): Promise<void> {
  const stats = createImportStats();

  try {
    console.log("========================================");
    console.log("IMDb IMPORT");
    console.log("========================================");
    console.log("");

    console.log("Connessione a MongoDB...");

    await connectDb();

    console.log("MongoDB connesso.");
    console.log("");

    console.log("1/7 - Selezione film...");

    const movies = await selectMovies();

    console.log(
      `Film selezionati: ${movies.length}`,
    );
    console.log("");

    console.log("2/7 - Raccolta relazioni IMDb...");

    const relations =
      await collectMovieRelations(movies);

    console.log(
      `Film con relazioni analizzate: ${relations.size}`,
    );
    console.log("");

    console.log("3/7 - Raccolta persone necessarie...");

    const personIds = collectPersonIds(relations);

    console.log(
      `Persone necessarie: ${personIds.size}`,
    );
    console.log("");

    console.log("4/7 - Ricerca persone nel dataset IMDb...");

    const people = await selectPeople(personIds);

    console.log(
      `Persone trovate: ${people.size}`,
    );
    console.log("");

    console.log("5/7 - Importazione generi...");

    const genreIds = await importGenres(
      movies,
      stats,
    );

    console.log(
      `Generi elaborati: ${genreIds.size}`,
    );
    console.log("");

    console.log("6/7 - Importazione persone...");

    const importedPersonIds = await importPeople(
      people,
      relations,
      stats,
    );

    console.log(
      `Persone importate: ${importedPersonIds.size}`,
    );
    console.log("");

    console.log("7/7 - Importazione film...");

    const importedMovieIds = await importMovies(
      movies,
      genreIds,
      stats,
    );

    console.log(
      `Film importati: ${importedMovieIds.size}`,
    );
    console.log("");

    console.log("Collegamento attori e registi...");

    await importMovieRelations(
      movies,
      relations,
      importedPersonIds,
      importedMovieIds,
      stats,
    );

    finishImportStats(stats);

    await logImportResult(stats);
  } catch (error) {
    addImportError(
      stats,
      error instanceof Error
        ? error.message
        : String(error),
    );

    finishImportStats(stats);

    console.error("");
    console.error("IMDb IMPORT FALLITO.");
    console.error("");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    try {
      await logImportResult(stats);
    } catch (logError) {
      console.error(
        "Impossibile scrivere il log dell'import:",
        logError,
      );
    }

    process.exitCode = 1;
  }
}

main();