import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

const movieSchema = new Schema(
  {
    imdbId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    titolo: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },

    descrizione: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },

    anno: {
      type: Number,
      required: true,
      min: 1888,
      max: 2100,
    },

    durata: {
      type: Number,
      required: true,
      min: 1,
      max: 600,
    },

    poster: {
      type: String,
      default: "",
      trim: true,
    },

    trailer: {
      type: String,
      default: "",
      trim: true,
    },

    streaming: {
      type: String,
      default: "",
      trim: true,
    },

    generi: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genere",
      },
    ],

    registi: [
      {
        type: Schema.Types.ObjectId,
        ref: "Persona",
      },
    ],

    attori: [
      {
        type: Schema.Types.ObjectId,
        ref: "Persona",
      },
    ],
  },
  {
    timestamps: true,
  },
);

movieSchema.index({ titolo: "text" });
movieSchema.index({ anno: -1 });

export type MovieDocument =
  InferSchemaType<typeof movieSchema> & {
    _id: mongoose.Types.ObjectId;
  };

export const MovieModel: Model<MovieDocument> =
  mongoose.models.Movie ??
  mongoose.model("Movie", movieSchema);