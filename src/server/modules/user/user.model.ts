import mongoose, {
    Schema,
    type InferSchemaType,
    type Model,
  } from "mongoose";
  
  const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
  
    email: {
      type: String,
      required: true,
      unique: true,
    },
  
    passwordHash: {
      type: String,
      required: true,
    },
  });
  
  export type UserDocument = InferSchemaType<typeof userSchema> & {
    _id: mongoose.Types.ObjectId;
  };
  
  export const UserModel: Model<UserDocument> =
    mongoose.models.User ??
    mongoose.model<UserDocument>("User", userSchema);