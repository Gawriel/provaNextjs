import { debugLog } from "@/src/lib/debug";
import { genereService } from "./genere.service";

/**
 * Controller HTTP del modulo Genere.
 * Qui stanno i nomi che ti aspetti: getGeneri, postGenere, putGenere...
 * app/api è solo l'adattatore Next che chiama queste funzioni.
 */
export async function getGeneri() {
  debugLog(4, "GenereController", "getGeneri");
  return genereService.getGeneri();
}

export async function postGenere(body: unknown) {
  debugLog(4, "GenereController", "postGenere");
  return genereService.createGenere(body);
}

export async function getGenere(id: string) {
  debugLog(4, "GenereController", "getGenere", { id });
  return genereService.getGenere(id);
}

export async function putGenere(id: string, body: unknown) {
  debugLog(4, "GenereController", "putGenere", { id });
  return genereService.updateGenere(id, body);
}

export async function deleteGenere(id: string) {
  debugLog(4, "GenereController", "deleteGenere", { id });
  return genereService.deleteGenere(id);
}
