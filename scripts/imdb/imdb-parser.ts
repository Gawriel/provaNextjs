import fs from "node:fs";
import readline from "node:readline";

export type ImdbName = {
    nconst: string;
    primaryName: string;
};

export type ImdbTitle = {
    tconst: string;
    titleType: string;
    primaryTitle: string;
    isAdult: boolean;
    startYear: number | null;
    runtimeMinutes: number | null;
    genres: string[];
};

export type ImdbCrew = {
    tconst: string;
    directors: string[];
};

export type ImdbPrincipal = {
    tconst: string;
    nconst: string;
    category: string;
};

function parseNullableNumber(value: string): number | null {
    if (value === "\\N" || value === "") {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;
}

function parseList(value: string): string[] {
    if (value === "\\N" || value === "") {
        return [];
    }

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function parseNameBasicsRow(line: string): ImdbName | null {
    const columns = line.split("\t");

    if (columns.length < 2) {
        return null;
    }

    const [nconst, primaryName] = columns;

    if (
        !nconst ||
        nconst === "\\N" ||
        !primaryName ||
        primaryName === "\\N"
    ) {
        return null;
    }

    return {
        nconst,
        primaryName,
    };
}

export function parseTitleBasicsRow(line: string): ImdbTitle | null {
    const columns = line.split("\t");

    if (columns.length < 9) {
        return null;
    }

    const [
        tconst,
        titleType,
        primaryTitle,
        _originalTitle,
        isAdult,
        startYear,
        _endYear,
        runtimeMinutes,
        genres,
    ] = columns;

    if (
        !tconst ||
        tconst === "\\N" ||
        !titleType ||
        titleType === "\\N" ||
        !primaryTitle ||
        primaryTitle === "\\N"
    ) {
        return null;
    }

    return {
        tconst,
        titleType,
        primaryTitle,
        isAdult: isAdult === "1",
        startYear: parseNullableNumber(startYear),
        runtimeMinutes: parseNullableNumber(runtimeMinutes),
        genres: parseList(genres),
    };
}

export function parseTitleCrewRow(line: string): ImdbCrew | null {
    const columns = line.split("\t");

    if (columns.length < 2) {
        return null;
    }

    const [tconst, directors] = columns;

    if (!tconst || tconst === "\\N") {
        return null;
    }

    return {
        tconst,
        directors: parseList(directors),
    };
}

export function parseTitlePrincipalsRow(
    line: string,
): ImdbPrincipal | null {
    const columns = line.split("\t");

    if (columns.length < 4) {
        return null;
    }

    const [tconst, _ordering, nconst, category] = columns;

    if (
        !tconst ||
        tconst === "\\N" ||
        !nconst ||
        nconst === "\\N" ||
        !category ||
        category === "\\N"
    ) {
        return null;
    }

    return {
        tconst,
        nconst,
        category,
    };
}

export type ReadTsvOptions = {
  maxRows?: number;
};

export async function readTsvFile(
  filePath: string,
  onRow: (line: string) => void | boolean | Promise<void | boolean>,
  options?: ReadTsvOptions,
): Promise<void> {
  const stream = fs.createReadStream(filePath, {
    encoding: "utf8",
  });

  const reader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let rowsRead = 0;

  for await (const line of reader) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    if (
      options?.maxRows !== undefined &&
      rowsRead >= options.maxRows
    ) {
      break;
    }

    const shouldStop = await onRow(line);

    rowsRead++;

    if (shouldStop === true) {
      break;
    }
  }
}

