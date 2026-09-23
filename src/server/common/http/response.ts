import { ApiError } from "./errors";

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data }, { status });
}

export function jsonError(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status });
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof Error && error.name === "ValidationError") {
    return jsonError(error.message, 400);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return jsonError("Valore già esistente (duplicato).", 409);
  }

  return jsonError("Errore interno del server.", 500);
}
