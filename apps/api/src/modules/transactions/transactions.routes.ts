import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import type { Prisma } from "../../generated/prisma/index.js";
import {
	createTransactionSchema,
	getTransactionsQuerySchema,
	updateTransactionSchema,
} from "./transactions.schema.js";

type Variables = {
	userId: string;
};

export const transactionRoutes = new Hono<{ Variables: Variables }>()
	.use("*", authMiddleware)

	// 1. GET /transactions (with filters and pagination)
	.get("/", zValidator("query", getTransactionsQuerySchema), async (c) => {
		const userId = c.get("userId");
		const query = c.req.valid("query");

		const where: Prisma.TransactionWhereInput = { userId };

		if (query.type) where.type = query.type;
		if (query.categoryId) where.categoryId = query.categoryId;

		if (query.startDate || query.endDate) {
			where.transactionDate = {};
			if (query.startDate)
				where.transactionDate.gte = new Date(query.startDate);
			if (query.endDate) {
				const end = new Date(query.endDate);
				end.setHours(23, 59, 59, 999);
				where.transactionDate.lte = end;
			}
		}

		// Calculate pagination constraints
		const page = query.page && query.page > 0 ? query.page : 1;
		const limit =
			query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 10;
		const skip = (page - 1) * limit;

		// Fetch rows and total count
		const [transactions, total] = await Promise.all([
			prisma.transaction.findMany({
				where,
				skip,
				take: limit,
				orderBy: {
					[query.sort]: query.order, // default desc
				},
				include: {
					category: {
						select: {
							id: true,
							name: true,
							icon: true,
						},
					},
				},
			}),
			prisma.transaction.count({ where }),
		]);

		return c.json(
			{
				data: transactions,
				meta: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
			200,
		);
	})

	// 2. GET /transactions/:id
	.get("/:id", async (c) => {
		const userId = c.get("userId");
		const id = c.req.param("id");

		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: {
				category: {
					select: { id: true, name: true, icon: true },
				},
			},
		});

		if (!transaction || transaction.userId !== userId) {
			throw new HTTPException(404, { message: "Transaksi tidak ditemukan" });
		}

		return c.json({ data: transaction }, 200);
	})

	// 3. POST /transactions
	.post("/", zValidator("json", createTransactionSchema), async (c) => {
		const userId = c.get("userId");
		const data = c.req.valid("json");

		// Validate category ownership & compatibility
		const category = await prisma.category.findUnique({
			where: { id: data.categoryId },
		});

		if (!category) {
			throw new HTTPException(404, { message: "Kategori tidak ditemukan" });
		}
		if (!category.isDefault && category.userId !== userId) {
			throw new HTTPException(403, { message: "Kategori tidak valid" });
		}
		if (category.type !== data.type) {
			throw new HTTPException(400, {
				message: `Tipe kategori (${category.type}) tidak cocok dengan tipe transaksi (${data.type})`,
			});
		}

		const transaction = await prisma.transaction.create({
			data: {
				userId,
				categoryId: data.categoryId,
				amount: data.amount,
				type: data.type,
				transactionDate: new Date(data.transactionDate),
				note: data.note,
			},
			include: { category: { select: { id: true, name: true, icon: true } } },
		});

		return c.json(
			{ message: "Transaksi berhasil dibuat", data: transaction },
			201,
		);
	})

	// 4. PUT /transactions/:id
	.put("/:id", zValidator("json", updateTransactionSchema), async (c) => {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const data = c.req.valid("json");

		// Check Ownership
		const transaction = await prisma.transaction.findUnique({ where: { id } });
		if (!transaction || transaction.userId !== userId) {
			throw new HTTPException(404, { message: "Transaksi tidak ditemukan" });
		}

		// Validation of Category if attempting to update
		if (data.categoryId || data.type) {
			const targetCategoryId = data.categoryId || transaction.categoryId;
			const targetType = data.type || transaction.type;

			const category = await prisma.category.findUnique({
				where: { id: targetCategoryId },
			});
			if (!category || (!category.isDefault && category.userId !== userId)) {
				throw new HTTPException(403, { message: "Kategori tidak valid" });
			}
			if (category.type !== targetType) {
				throw new HTTPException(400, {
					message: "Tipe kategori tidak sesuai dengan tipe transaksi",
				});
			}
		}

		const updatedData: Prisma.TransactionUpdateInput = { ...data };
		if (data.transactionDate) {
			updatedData.transactionDate = new Date(data.transactionDate);
		}

		const updated = await prisma.transaction.update({
			where: { id },
			data: updatedData,
			include: { category: { select: { id: true, name: true, icon: true } } },
		});

		return c.json(
			{ message: "Transaksi berhasil diperbarui", data: updated },
			200,
		);
	})

	// 5. DELETE /transactions/:id
	.delete("/:id", async (c) => {
		const userId = c.get("userId");
		const id = c.req.param("id");

		const transaction = await prisma.transaction.findUnique({ where: { id } });
		if (!transaction || transaction.userId !== userId) {
			throw new HTTPException(404, { message: "Transaksi tidak ditemukan" });
		}

		await prisma.transaction.delete({ where: { id } });

		return c.json({ message: "Transaksi berhasil dihapus" }, 200);
	});
