import { debugLog } from "@/src/lib/debug";
import { personaService } from "./persona.service";

export async function getPersone(ruolo?: string) {
  debugLog(4, "PersonaController", "getPersone", { ruolo });
  return personaService.getPersone(ruolo);
}

export async function postPersona(body: unknown) {
  debugLog(4, "PersonaController", "postPersona");
  return personaService.createPersona(body);
}

export async function getPersona(id: string) {
  debugLog(4, "PersonaController", "getPersona", { id });
  return personaService.getPersona(id);
}

export async function putPersona(id: string, body: unknown) {
  debugLog(4, "PersonaController", "putPersona", { id });
  return personaService.updatePersona(id, body);
}

export async function deletePersona(id: string) {
  debugLog(4, "PersonaController", "deletePersona", { id });
  return personaService.deletePersona(id);
}
