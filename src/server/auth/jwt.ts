import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET non configurato.");
}

const secretKey = new TextEncoder().encode(secret);

export type JwtPayload = {
    userId: string;
    email: string;
    username: string;
};

export async function createToken(payload: JwtPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secretKey);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secretKey);

    return payload;
}