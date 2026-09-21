import type { Genere } from "./genere";
import type { Persona } from "./persona";

/**
 * Forma usata dal frontend dopo populate.
 * generi/registi/attori non sono stringhe: sono documenti collegati.
 */
export type Movie = {
  id: string;
  imdbId: string;
  titolo: string;
  descrizione: string;
  anno: number;
  durata: number;
  poster: string;
  trailer: string;
  streaming: string;
  generi: Genere[];
  registi: Persona[];
  attori: Persona[];
};

/** Body per POST/PUT: il film salva solo gli id, non i nomi. */
export type MovieWrite = {
  titolo: string;
  descrizione: string;
  anno: number;
  durata: number;
  poster?: string;
  trailer?: string;
  streaming?: string;
  genereIds?: string[];
  registaIds?: string[];
  attoreIds?: string[];
};
