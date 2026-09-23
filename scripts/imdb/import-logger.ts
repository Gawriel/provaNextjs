import fs from "node:fs/promises";
import path from "node:path";

import {
  type EntityStats,
  type ImportStats,
  getImportDurationMs,
} from "./import-stats";

const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIRECTORY, "imdb-import.log");

function formatNumber(value: number): string {
  return value.toLocaleString("it-IT");
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatDate(date: Date): string {
  return date.toLocaleString("it-IT");
}

function formatEntityStats(
  label: string,
  stats: EntityStats,
): string {
  return [
    label,
    `  Letti:       ${formatNumber(stats.read)}`,
    `  Nuovi:       ${formatNumber(stats.created)}`,
    `  Aggiornati:  ${formatNumber(stats.updated)}`,
    `  Invariati:   ${formatNumber(stats.unchanged)}`,
    `  Errori:      ${formatNumber(stats.errors)}`,
  ].join("\n");
}

export function formatImportReport(stats: ImportStats): string {
  const duration = getImportDurationMs(stats);

  const lines = [
    "",
    "==================================================",
    `IMDb IMPORT - ${formatDate(stats.startedAt)}`,
    "==================================================",
    "",
    formatEntityStats("PERSONE", stats.persons),
    "",
    formatEntityStats("GENERI", stats.genres),
    "",
    formatEntityStats("FILM", stats.movies),
    "",
    "RELAZIONI",
    `  Registi aggiunti: ${formatNumber(
      stats.relations.directorsAdded,
    )}`,
    `  Attori aggiunti:  ${formatNumber(
      stats.relations.actorsAdded,
    )}`,
    "",
    "RISULTATO",
    `  Nuove persone: ${formatNumber(stats.persons.created)}`,
    `  Nuovi film:    ${formatNumber(stats.movies.created)}`,
    `  Nuovi generi:  ${formatNumber(stats.genres.created)}`,
    "",
    `Durata: ${formatDuration(duration)}`,
  ];

  if (stats.errors.length > 0) {
    lines.push("");
    lines.push("DETTAGLIO ERRORI");

    for (const error of stats.errors) {
      lines.push(`  - ${error}`);
    }
  }

  lines.push("==================================================");
  lines.push("");

  return lines.join("\n");
}

async function ensureLogDirectory(): Promise<void> {
  await fs.mkdir(LOG_DIRECTORY, {
    recursive: true,
  });
}

export async function writeImportLog(
  stats: ImportStats,
): Promise<void> {
  await ensureLogDirectory();

  const report = formatImportReport(stats);

  await fs.appendFile(LOG_FILE, report, "utf8");
}

export function printImportReport(stats: ImportStats): void {
  const report = formatImportReport(stats);

  console.log(report);
}

export async function logImportResult(
  stats: ImportStats,
): Promise<void> {
  printImportReport(stats);
  await writeImportLog(stats);
}
