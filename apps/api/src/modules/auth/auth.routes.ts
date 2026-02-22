import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import {
	loginSchema,
	registerSchema,
	updateProfileSchema,
} from "./auth.schema.js";
import { generateToken, hashPassword, verifyPassword } from "./auth.utils.js";

// Hono context typing if needed, but often inferred
type Variables = {
	userId: string;
};

export const authRoutes = new Hono<{ Variables: Variables }>()

	// 1. Register Route
	.post("/register", zValidator("json", registerSchema), async (c) => {
		const { email, password, fullName } = c.req.valid("json");

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw new HTTPException(409, { message: "Email sudah terdaftar" });
		}

		// Hash password and save data
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

		// Find user
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new HTTPException(401, { message: "Email atau password salah" });
		}

		// Verify password
		const isPasswordValid = await verifyPassword(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new HTTPException(401, { message: "Email atau password salah" });
		}

		// Generate token
		const token = await generateToken(user.id);

		// Exclude passwordHash from response
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

	// 3. Get Profile (Protected)
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

	// 4. Update Profile (Protected)
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
