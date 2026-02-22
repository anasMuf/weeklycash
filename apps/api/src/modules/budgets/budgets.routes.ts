import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import { TransactionType } from "../../generated/prisma/index.js";
import {
	createBudgetSchema,
	getBudgetsQuerySchema,
	updateBudgetSchema,
} from "./budgets.schema.js";

type Variables = {
	userId: string;
};

export const budgetRoutes = new Hono<{ Variables: Variables }>()
	.use("*", authMiddleware)

	// Helper function for computing statistics
	// We map the array of transactions to calculate metrics dynamically

	// 1. GET /budgets/current
	.get("/current", async (c) => {
		const userId = c.get("userId");

		const today = new Date();
		const currentBudget = await prisma.budget.findFirst({
			where: {
				userId,
				startDate: { lte: today },
				endDate: { gte: today },
			},
		});

		if (!currentBudget) {
			throw new HTTPException(404, {
				message: "Belum ada anggaran untuk minggu ini",
			});
		}

		// Hitung total expense & transacion count during that week
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				transactionDate: {
					gte: currentBudget.startDate,
					lte: currentBudget.endDate,
				},
				type: TransactionType.EXPENSE,
			},
			select: { amount: true },
		});

		const spent = transactions.reduce(
			(acc, curr) => acc + Number(curr.amount),
			0,
		);
		const limit = Number(currentBudget.amountLimit);
		const remaining = limit - spent;
		const percentage = Math.min((spent / limit) * 100, 100);

		return c.json(
			{
				data: {
					...currentBudget,
					amountLimit: limit,
					spent,
					remaining,
					percentage,
					transactionCount: transactions.length,
				},
			},
			200,
		);
	})

	// 2. GET /budgets
	.get("/", zValidator("query", getBudgetsQuerySchema), async (c) => {
		const userId = c.get("userId");
		const { page, limit } = c.req.valid("query");

		const computedLimit = limit && limit > 0 && limit <= 100 ? limit : 10;
		const computedPage = page && page > 0 ? page : 1;
		const skip = (computedPage - 1) * computedLimit;

		const [budgets, total] = await Promise.all([
			prisma.budget.findMany({
				where: { userId },
				orderBy: { startDate: "desc" },
				skip,
				take: computedLimit,
			}),
			prisma.budget.count({ where: { userId } }),
		]);

		// For each budget we need to compute spent and remaining
		const enrichedBudgets = await Promise.all(
			budgets.map(async (budget) => {
				const expAgg = await prisma.transaction.aggregate({
					where: {
						userId,
						transactionDate: { gte: budget.startDate, lte: budget.endDate },
						type: TransactionType.EXPENSE,
					},
					_sum: { amount: true },
				});

				const spent = Number(expAgg._sum.amount || 0);
				const amountLimit = Number(budget.amountLimit);
				const remaining = amountLimit - spent;
				const percentage = Math.min((spent / amountLimit) * 100, 100);

				return {
					...budget,
					amountLimit,
					spent,
					remaining,
					percentage,
				};
			}),
		);

		return c.json(
			{
				data: enrichedBudgets,
				meta: {
					page: computedPage,
					limit: computedLimit,
					total,
					totalPages: Math.ceil(total / computedLimit),
				},
			},
			200,
		);
	})

	// 3. POST /budgets
	.post("/", zValidator("json", createBudgetSchema), async (c) => {
		const userId = c.get("userId");
		const data = c.req.valid("json");

		const startDate = new Date(data.startDate);
		const endDate = new Date(data.endDate);

		// ensure end_date is exactly start_date + 6 days
		const expectedEndDate = new Date(startDate);
		expectedEndDate.setDate(startDate.getDate() + 6);

		// Set hours to precisely match bounds
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 999);
		expectedEndDate.setHours(23, 59, 59, 999);

		if (endDate.getTime() !== expectedEndDate.getTime()) {
			throw new HTTPException(400, {
				message:
					"Tanggal selesai harus tepat 6 hari setelah tanggal mulai (Senin - Minggu).",
			});
		}

		// check explicit uniqueness manually to return 409
		const existing = await prisma.budget.findFirst({
			where: {
				userId,
				startDate,
			},
		});

		if (existing) {
			throw new HTTPException(409, {
				message: "Anggaran untuk minggu ini sudah dibuat",
			});
		}

		const newBudget = await prisma.budget.create({
			data: {
				userId,
				amountLimit: data.amountLimit,
				startDate,
				endDate,
			},
		});

		return c.json(
			{ message: "Anggaran berhasil dibuat", data: newBudget },
			201,
		);
	})

	// 4. PUT /budgets/:id
	.put("/:id", zValidator("json", updateBudgetSchema), async (c) => {
		const userId = c.get("userId");
		const id = c.req.param("id");
		const data = c.req.valid("json");

		const budget = await prisma.budget.findUnique({ where: { id } });
		if (!budget || budget.userId !== userId) {
			throw new HTTPException(404, { message: "Anggaran tidak ditemukan" });
		}

		const updated = await prisma.budget.update({
			where: { id },
			data: {
				amountLimit: data.amountLimit,
			},
		});

		return c.json(
			{ message: "Anggaran berhasil diperbarui", data: updated },
			200,
		);
	});
