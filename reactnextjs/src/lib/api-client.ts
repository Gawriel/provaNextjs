type ApiSuccess<T> = { ok: true; data: T };
type ApiFailure = { ok: false; error: string };

/** Client HTTP per il frontend. Non importare mai mongoose da qui. */
export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !payload.ok) {
    const message = !payload.ok ? payload.error : "Richiesta API fallita.";
    throw new Error(message);
  }

  return payload.data;
}
