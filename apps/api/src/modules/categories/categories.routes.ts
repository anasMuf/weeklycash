import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import { zValidator } from "../../core/utils/validator.js";
import type { Prisma } from "../../generated/prisma/index.js";
import {
	createCategorySchema,
	getCategoryQuerySchema,
	updateCategorySchema,
} from "./categories.schema.js";

type Variables = {
	userId: string;
};

export const categoryRoutes = new Hono<{ Variables: Variables }>()
	.use("*", authMiddleware)

	// 1. GET /categories (User + Default)
	.get("/", zValidator("query", getCategoryQuerySchema), async (c) => {
		const userId = c.get("userId");
		const { type } = c.req.valid("query");

		const whereClause: Prisma.CategoryWhereInput = {
			OR: [{ userId: null, isDefault: true }, { userId }],
		};

		if (type) {
			whereClause.type = type;
		}

		const categories = await prisma.category.findMany({
			where: whereClause,
			orderBy: [{ isDefault: "desc" }, { name: "asc" }],
		});

		return c.json({ data: categories }, 200);
	})

	// 2. POST /categories (Custom category)
	.post("/", zValidator("json", createCategorySchema), async (c) => {
		const userId = c.get("userId");
		const data = c.req.valid("json");

		const category = await prisma.category.create({
			data: {
				...data,
				userId,
				isDefault: false,
			},
		});

		return c.json(
			{ message: "Kategori berhasil ditambahkan", data: category },
			201,
		);
	})

	// 3. PUT /categories/:id (Update custom category)
	.put("/:id", zValidator("json", updateCategorySchema), async (c) => {
		const userId = c.get("userId");
		const categoryId = c.req.param("id");
		const data = c.req.valid("json");

		// Find category
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			throw new HTTPException(404, { message: "Kategori tidak ditemukan" });
		}

		if (category.isDefault) {
			throw new HTTPException(403, {
				message: "Kategori bawaan (default) tidak dapat diubah",
			});
		}

		if (category.userId !== userId) {
			throw new HTTPException(403, {
				message: "Anda tidak memiliki akses ke kategori ini",
			});
		}

		// Update
		const updatedCategory = await prisma.category.update({
			where: { id: categoryId },
			data,
		});

		return c.json(
			{ message: "Kategori berhasil diperbarui", data: updatedCategory },
			200,
		);
	})

	// 4. DELETE /categories/:id (Delete custom category)
	.delete("/:id", async (c) => {
		const userId = c.get("userId");
		const categoryId = c.req.param("id");

		// Find category
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			throw new HTTPException(404, { message: "Kategori tidak ditemukan" });
		}

		if (category.isDefault) {
			throw new HTTPException(403, {
				message: "Kategori bawaan (default) tidak dapat dihapus",
			});
		}

		if (category.userId !== userId) {
			throw new HTTPException(403, {
				message: "Anda tidak memiliki akses ke kategori ini",
			});
		}

		// Check if used in transactions
		const transactionCount = await prisma.transaction.count({
			where: { categoryId: categoryId },
		});

		if (transactionCount > 0) {
			throw new HTTPException(409, {
				message:
					"Kategori tidak bisa dihapus karena masih digunakan pada transaksi",
			});
		}

		// Proceed delete
		await prisma.category.delete({
			where: { id: categoryId },
		});

		return c.json({ message: "Kategori berhasil dihapus" }, 200);
	});
