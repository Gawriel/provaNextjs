import { connectDb } from "@/src/server/common/db/connect";
import { UserModel } from "./user.model";

export const userRepository = {
    async findByEmail(email: string) {
        await connectDb();

        return UserModel.findOne({ email }).lean();
    },

    async findByUsername(username: string) {
        await connectDb();

        return UserModel.findOne({ username }).lean();
    },

    async findById(id: string) {
        await connectDb();
      
        return UserModel.findById(id).lean();
      },

    async create(username: string, email: string, passwordHash: string) {
        await connectDb();

        const user = await UserModel.create({
            username,
            email,
            passwordHash,
        });

        return user;
    },
};