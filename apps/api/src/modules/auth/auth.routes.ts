import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import { zValidator } from "../../core/utils/validator.js";
import {
	loginSchema,
	registerSchema,
	updateProfileSchema,
} from "./auth.schema.js";
import { generateToken, hashPassword, verifyPassword } from "./auth.utils.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

type Variables = {
	userId: string;
};

export const authRoutes = new Hono<{ Variables: Variables }>()

	// 1. Register Route
	.post("/register", zValidator("json", registerSchema), async (c) => {
		const { email, password, fullName } = c.req.valid("json");

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw new HTTPException(409, { message: "Email sudah terdaftar" });
		}

		const hashedPassword = await hashPassword(password);
		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
				fullName,
			},
			select: {
				id: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return c.json({ message: "Registrasi berhasil", data: newUser }, 201);
	})

	// 2. Login Route
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const { email, password } = c.req.valid("json");

		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new HTTPException(401, { message: "Email atau password salah" });
		}

		const isPasswordValid = await verifyPassword(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new HTTPException(401, { message: "Email atau password salah" });
		}

		const token = await generateToken(user.id);

		// Set HttpOnly cookie
		setCookie(c, COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Lax",
			path: "/",
			maxAge: COOKIE_MAX_AGE,
		});

		const { passwordHash, ...userData } = user;

		return c.json(
			{
				message: "Login berhasil",
				data: {
					token,
					user: userData,
				},
			},
			200,
		);
	})

	// 3. Logout Route
	.post("/logout", (c) => {
		deleteCookie(c, COOKIE_NAME, {
			path: "/",
		});
		return c.json({ message: "Logout berhasil" }, 200);
	})

	// 4. Get Profile (Protected)
	.get("/me", authMiddleware, async (c) => {
		const userId = c.get("userId");

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new HTTPException(404, { message: "User tidak ditemukan" });
		}

		return c.json({ data: user }, 200);
	})

	// 5. Update Profile (Protected)
	.put(
		"/me",
		authMiddleware,
		zValidator("json", updateProfileSchema),
		async (c) => {
			const userId = c.get("userId");
			const { fullName } = c.req.valid("json");

			try {
				const updatedUser = await prisma.user.update({
					where: { id: userId },
					data: { fullName },
					select: {
						id: true,
						email: true,
						fullName: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				return c.json(
					{ message: "Profil berhasil diperbarui", data: updatedUser },
					200,
				);
			} catch (_error) {
				throw new HTTPException(500, { message: "Gagal memperbarui profil" });
			}
		},
	);
