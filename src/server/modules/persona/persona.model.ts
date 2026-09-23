import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

const RUOLI = ["attore", "regista"] as const;

const personaSchema = new Schema(
  {
    imdbId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    nome: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    foto: {
      type: String,
      default: "",
      trim: true,
    },

    ruoli: {
      type: [
        {
          type: String,
          enum: RUOLI,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export type PersonaDocument =
  InferSchemaType<typeof personaSchema> & {
    _id: mongoose.Types.ObjectId;
  };

export const PersonaModel: Model<PersonaDocument> =
  mongoose.models.Persona ??
  mongoose.model("Persona", personaSchema);