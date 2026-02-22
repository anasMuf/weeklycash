import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verifyToken } from "../../modules/auth/auth.utils.js";

export async function authMiddleware(c: Context, next: Next) {
	// 1. Try cookie first (preferred, works with SSR)
	let token = getCookie(c, "token");

	// 2. Fallback to Authorization header
	if (!token) {
		const authHeader = c.req.header("Authorization");
		if (authHeader?.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
		}
	}

	if (!token) {
		throw new HTTPException(401, { message: "Missing or invalid token" });
	}

	try {
		const { userId } = await verifyToken(token);
		c.set("userId", userId);
		await next();
	} catch (_error) {
		throw new HTTPException(401, { message: "Invalid token" });
	}
}
