import { compare, hash } from "bcryptjs";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-development";

export async function hashPassword(plain: string): Promise<string> {
	return hash(plain, 10);
}

export async function verifyPassword(
	plain: string,
	hashed: string,
): Promise<boolean> {
	return compare(plain, hashed);
}

export async function generateToken(userId: string): Promise<string> {
	const payload = {
		userId,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
	};
	return sign(payload, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
	const decoded = await verify(token, JWT_SECRET, "HS256");
	return { userId: decoded.userId as string };
}
