import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const genereSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 40,
    },
  },
  { timestamps: true },
);

export type GenereDocument = InferSchemaType<typeof genereSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GenereModel: Model<GenereDocument> =
  mongoose.models.Genere ?? mongoose.model("Genere", genereSchema);
