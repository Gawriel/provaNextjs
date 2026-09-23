import mongoose, {
    Schema,
    type InferSchemaType,
    type Model,
  } from "mongoose";
  
  const TIPI = ["favorite", "watchlist"] as const;
  
  const movieListUserSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
  
      movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
        index: true,
      },
  
      type: {
        type: String,
        enum: TIPI,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  );
  
  movieListUserSchema.index(
    { userId: 1, movieId: 1, type: 1 },
    { unique: true },
  );
  
  export type MovieListUserDocument =
    InferSchemaType<typeof movieListUserSchema> & {
      _id: mongoose.Types.ObjectId;
    };
  
  export type MovieListUserType = (typeof TIPI)[number];
  
  export const MovieListUserModel: Model<MovieListUserDocument> =
    mongoose.models.MovieListUser ??
    mongoose.model("MovieListUser", movieListUserSchema);