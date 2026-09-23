export type RuoloPersona = "attore" | "regista";

export type Persona = {
  id: string;
  nome: string;
  bio: string;
  foto: string;
  ruoli: RuoloPersona[];
};

export type PersonaWrite = {
  nome: string;
  bio?: string;
  foto?: string;
  ruoli?: RuoloPersona[];
};
