/**
 * Debug logger controllato da env e/o flag locale.
 * Scrive log se DEBUG_ENABLE (env) O debugEnableLocale è true.
 * Livello 1-4 (default 4). Più alto = più verboso.
 */

export type DebugLevel = 1 | 2 | 3 | 4;

/** Override locale (utile in sviluppo senza toccare .env) */
export let debugEnableLocale = false;

const DEFAULT_LEVEL: DebugLevel = 4;

function parseEnable(value: string | undefined): boolean {
  if (!value) return false;
  return value === "true" || value === "1";
}

function parseLevel(value: string | undefined): DebugLevel {
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  return DEFAULT_LEVEL;
}

function isEnabled(): boolean {
  const fromEnv = parseEnable(process.env.DEBUG_ENABLE);
  const fromPublic = parseEnable(process.env.NEXT_PUBLIC_DEBUG_ENABLE);
  return fromEnv || fromPublic || debugEnableLocale;
}

function currentLevel(): DebugLevel {
  return parseLevel(
    process.env.DEBUG_LEVEL ?? process.env.NEXT_PUBLIC_DEBUG_LEVEL,
  );
}

/**
 * @param level 1=error-critical, 2=warn, 3=info, 4=verbose/trace
 * @param scope etichetta (es. "SiteNav")
 * @param message messaggio
 * @param data opzionale
 */
export function debugLog(
  level: DebugLevel,
  scope: string,
  message: string,
  data?: unknown,
): void {
  if (!isEnabled()) return;
  if (level > currentLevel()) return;

  const prefix = `[DEBUG L${level}][${scope}]`;
  if (data !== undefined) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
}
