import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyToken } from "../../modules/auth/auth.utils.js";

export async function authMiddleware(c: Context, next: Next) {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new HTTPException(401, { message: "Missing or invalid token" });
	}

	const token = authHeader.split(" ")[1];
	try {
		const { userId } = await verifyToken(token);
		c.set("userId", userId);
		await next();
	} catch (_error) {
		throw new HTTPException(401, { message: "Invalid token" });
	}
}
