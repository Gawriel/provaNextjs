import mongoose from "mongoose";

import { GenereModel } from "@/src/server/modules/genere/genere.model";
import { MovieModel } from "@/src/server/modules/movie/movie.model";
import { PersonaModel } from "@/src/server/modules/persona/persona.model";

import type { ImdbName, ImdbTitle } from "./imdb-parser";
import type { ImportStats } from "./import-stats";

export type MovieRelations = {
    directors: Set<string>;
    actors: Set<string>;
};


export async function importGenres(
    movies: ImdbTitle[],
    stats: ImportStats,
): Promise<Map<string, string>> {
    const genreIds = new Map<string, string>();

    const uniqueGenres = new Set<string>();

    for (const movie of movies) {
        for (const genre of movie.genres) {
            uniqueGenres.add(genre);
        }
    }

    for (const genreName of uniqueGenres) {
        stats.genres.read++;

        try {
            const existingGenre = await GenereModel.findOne({
                nome: genreName,
            });

            if (!existingGenre) {
                const createdGenre = await GenereModel.create({
                    nome: genreName,
                });

                stats.genres.created++;

                genreIds.set(
                    genreName,
                    String(createdGenre._id),
                );

                continue;
            }

            stats.genres.unchanged++;

            genreIds.set(
                genreName,
                String(existingGenre._id),
            );
        } catch (error) {
            stats.genres.errors++;

            stats.errors.push(
                `Errore genere "${genreName}": ${error instanceof Error
                    ? error.message
                    : String(error)
                }`,
            );
        }
    }

    return genreIds;
}

export async function importPeople(
    people: Map<string, ImdbName>,
    relations: Map<string, MovieRelations>,
    stats: ImportStats,
): Promise<Map<string, string>> {
    const personIds = new Map<string, string>();

    const personRoles = new Map<
        string,
        Set<"attore" | "regista">
    >();

    for (const relation of relations.values()) {
        for (const nconst of relation.directors) {
            const roles =
                personRoles.get(nconst) ??
                new Set<"attore" | "regista">();

            roles.add("regista");
            personRoles.set(nconst, roles);
        }

        for (const nconst of relation.actors) {
            const roles =
                personRoles.get(nconst) ??
                new Set<"attore" | "regista">();

            roles.add("attore");
            personRoles.set(nconst, roles);
        }
    }

    for (const [nconst, person] of people) {
        stats.persons.read++;

        try {
            const importedRoles = [
                ...(personRoles.get(nconst) ?? new Set()),
            ].sort();

            const existingPerson = await PersonaModel.findOne({
                imdbId: nconst,
            });

            if (!existingPerson) {
                const createdPerson = await PersonaModel.create({
                    imdbId: nconst,
                    nome: person.primaryName,
                    ruoli: importedRoles,
                });

                stats.persons.created++;

                personIds.set(
                    nconst,
                    String(createdPerson._id),
                );

                continue;
            }

            const existingRoles = [
                ...existingPerson.ruoli,
            ].sort();

            const nameChanged =
                existingPerson.nome !== person.primaryName;

            const rolesChanged =
                existingRoles.length !== importedRoles.length ||
                existingRoles.some(
                    (role, index) =>
                        role !== importedRoles[index],
                );

            if (!nameChanged && !rolesChanged) {
                stats.persons.unchanged++;

                personIds.set(
                    nconst,
                    String(existingPerson._id),
                );

                continue;
            }

            existingPerson.nome = person.primaryName;
            existingPerson.ruoli = importedRoles;

            await existingPerson.save();

            stats.persons.updated++;

            personIds.set(
                nconst,
                String(existingPerson._id),
            );
        } catch (error) {
            stats.persons.errors++;

            stats.errors.push(
                `Errore persona "${person.primaryName}" (${nconst}): ${error instanceof Error
                    ? error.message
                    : String(error)
                }`,
            );
        }
    }

    return personIds;
}

export async function importMovies(
    movies: ImdbTitle[],
    genreIds: Map<string, string>,
    stats: ImportStats,
): Promise<Map<string, string>> {
    const movieIds = new Map<string, string>();

    for (const movie of movies) {
        stats.movies.read++;

        try {
            const genreObjectIds = movie.genres
                .map((genre) => genreIds.get(genre))
                .filter(
                    (id): id is string => id !== undefined,
                )
                .map(
                    (id) => new mongoose.Types.ObjectId(id),
                );


            const existingMovie = await MovieModel.findOne({
                imdbId: movie.tconst,
            });

            if (!existingMovie) {
                const createdMovie = await MovieModel.create({
                    imdbId: movie.tconst,
                    titolo: movie.primaryTitle,
                    anno: movie.startYear!,
                    durata: movie.runtimeMinutes!,
                    generi: genreObjectIds,
                });

                stats.movies.created++;

                movieIds.set(
                    movie.tconst,
                    String(createdMovie._id),
                );

                continue;
            }

            const existingGenreIds = existingMovie.generi
                .map((id) => String(id))
                .sort();

            const importedGenreIds = genreObjectIds
                .map((id) => String(id))
                .sort();

            const titleChanged =
                existingMovie.titolo !== movie.primaryTitle;

            const yearChanged =
                existingMovie.anno !== movie.startYear;

            const durationChanged =
                existingMovie.durata !== movie.runtimeMinutes;

            const genresChanged =
                existingGenreIds.length !==
                importedGenreIds.length ||
                existingGenreIds.some(
                    (id, index) =>
                        id !== importedGenreIds[index],
                );

            const hasChanges =
                titleChanged ||
                yearChanged ||
                durationChanged ||
                genresChanged;

            if (!hasChanges) {
                stats.movies.unchanged++;

                movieIds.set(
                    movie.tconst,
                    String(existingMovie._id),
                );

                continue;
            }

            existingMovie.titolo = movie.primaryTitle;
            existingMovie.anno = movie.startYear!;
            existingMovie.durata = movie.runtimeMinutes!;
            existingMovie.generi = genreObjectIds;

            await existingMovie.save();

            stats.movies.updated++;

            movieIds.set(
                movie.tconst,
                String(existingMovie._id),
            );
        } catch (error) {
            stats.movies.errors++;

            stats.errors.push(
                `Errore film "${movie.primaryTitle}" (${movie.tconst}): ${error instanceof Error
                    ? error.message
                    : String(error)
                }`,
            );
        }
    }

    return movieIds;
}

export async function importMovieRelations(
  movies: ImdbTitle[],
  relations: Map<string, MovieRelations>,
  personIds: Map<string, string>,
  movieIds: Map<string, string>,
  stats: ImportStats,
): Promise<void> {
  for (const movie of movies) {
    const relation = relations.get(movie.tconst);

    if (!relation) {
      continue;
    }

    const movieId = movieIds.get(movie.tconst);

    if (!movieId) {
      stats.errors.push(
        `Relazioni saltate: film "${movie.primaryTitle}" (${movie.tconst}) non importato.`,
      );

      continue;
    }

    try {
      const directorIds = [...relation.directors]
        .map((nconst) => personIds.get(nconst))
        .filter(
          (id): id is string => id !== undefined,
        )
        .map(
          (id) => new mongoose.Types.ObjectId(id),
        );

      const actorIds = [...relation.actors]
        .map((nconst) => personIds.get(nconst))
        .filter(
          (id): id is string => id !== undefined,
        )
        .map(
          (id) => new mongoose.Types.ObjectId(id),
        );

      const movieDocument = await MovieModel.findById(
        movieId,
      );

      if (!movieDocument) {
        stats.errors.push(
          `Relazioni saltate: film "${movie.primaryTitle}" (${movie.tconst}) non trovato nel database.`,
        );

        continue;
      }

      const existingDirectorIds = movieDocument.registi.map(
        (id) => String(id),
      );

      const existingActorIds = movieDocument.attori.map(
        (id) => String(id),
      );

      const newDirectorIds = directorIds.filter(
        (id) =>
          !existingDirectorIds.includes(String(id)),
      );

      const newActorIds = actorIds.filter(
        (id) =>
          !existingActorIds.includes(String(id)),
      );

      if (newDirectorIds.length > 0) {
        movieDocument.registi.push(...newDirectorIds);
      }

      if (newActorIds.length > 0) {
        movieDocument.attori.push(...newActorIds);
      }

      if (
        newDirectorIds.length > 0 ||
        newActorIds.length > 0
      ) {
        await movieDocument.save();
      }

      stats.relations.directorsAdded +=
        newDirectorIds.length;

      stats.relations.actorsAdded +=
        newActorIds.length;
    } catch (error) {
      stats.errors.push(
        `Errore relazioni film "${movie.primaryTitle}" (${movie.tconst}): ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      );
    }
  }
}

