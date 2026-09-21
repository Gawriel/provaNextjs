export type EntityStats = {
  read: number;
  created: number;
  updated: number;
  unchanged: number;
  errors: number;
};

export type RelationStats = {
  directorsAdded: number;
  actorsAdded: number;
};

export type ImportStats = {
  startedAt: Date;
  finishedAt?: Date;

  persons: EntityStats;
  genres: EntityStats;
  movies: EntityStats;

  relations: RelationStats;

  errors: string[];
};

export function createImportStats(): ImportStats {
  return {
    startedAt: new Date(),

    persons: {
      read: 0,
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0,
    },

    genres: {
      read: 0,
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0,
    },

    movies: {
      read: 0,
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0,
    },

    relations: {
      directorsAdded: 0,
      actorsAdded: 0,
    },

    errors: [],
  };
}

export function finishImportStats(stats: ImportStats): void {
  stats.finishedAt = new Date();
}

export function getImportDurationMs(stats: ImportStats): number {
  const end = stats.finishedAt ?? new Date();

  return end.getTime() - stats.startedAt.getTime();
}

export function addImportError(
  stats: ImportStats,
  message: string,
): void {
  stats.errors.push(message);
}
