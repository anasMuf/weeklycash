import { Hono } from "hono";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";
import { prisma } from "../../core/utils/prisma.js";
import { TransactionType } from "../../generated/prisma/index.js";

type Variables = {
	userId: string;
};

export const dashboardRoutes = new Hono<{ Variables: Variables }>()
	.use("*", authMiddleware)
	.get("/summary", async (c) => {
		const userId = c.get("userId");

		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1);

		const startOfWeek = new Date(today.setDate(diff));
		startOfWeek.setHours(0, 0, 0, 0);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		endOfWeek.setHours(23, 59, 59, 999);

		// 1. Current Budget
		let currentBudgetStats = null;
		const currentBudget = await prisma.budget.findFirst({
			where: {
				userId,
				startDate: { lte: new Date() },
				endDate: { gte: new Date() },
			},
		});

		if (currentBudget) {
			const expenseSum = await prisma.transaction.aggregate({
				where: {
					userId,
					transactionDate: {
						gte: currentBudget.startDate,
						lte: currentBudget.endDate,
					},
					type: TransactionType.EXPENSE,
				},
				_sum: { amount: true },
			});
			const spent = Number(expenseSum._sum.amount || 0);
			const amountLimit = Number(currentBudget.amountLimit);
			currentBudgetStats = {
				...currentBudget,
				amountLimit,
				spent,
				remaining: amountLimit - spent,
				percentage: Math.min((spent / amountLimit) * 100, 100),
			};
		}

		// 2. Weekly Summary
		const weeklyTransactions = await prisma.transaction.findMany({
			where: {
				userId,
				transactionDate: { gte: startOfWeek, lte: endOfWeek },
			},
		});

		const totalIncome = weeklyTransactions
			.filter((t) => t.type === TransactionType.INCOME)
			.reduce((acc, curr) => acc + Number(curr.amount), 0);

		const totalExpense = weeklyTransactions
			.filter((t) => t.type === TransactionType.EXPENSE)
			.reduce((acc, curr) => acc + Number(curr.amount), 0);

		const weeklySummary = {
			totalIncome,
			totalExpense,
			transactionCount: weeklyTransactions.length,
		};

		// 3. Category Breakdown (Expenses ONLY, minggu ini)
		const categoryGroups: Record<
			string,
			{ categoryId: string; total: number; percentage: number }
		> = {};
		for (const tx of weeklyTransactions.filter(
			(t) => t.type === TransactionType.EXPENSE,
		)) {
			if (!categoryGroups[tx.categoryId]) {
				categoryGroups[tx.categoryId] = {
					categoryId: tx.categoryId,
					total: 0,
					percentage: 0,
				};
			}
			categoryGroups[tx.categoryId].total += Number(tx.amount);
		}

		// Hitung persentase dari breakdown category
		const categoryBreakdown = await Promise.all(
			Object.values(categoryGroups).map(async (group) => {
				const category = await prisma.category.findUnique({
					where: { id: group.categoryId },
				});
				return {
					categoryId: group.categoryId,
					name: category?.name,
					icon: category?.icon,
					total: group.total,
					percentage: totalExpense > 0 ? (group.total / totalExpense) * 100 : 0,
				};
			}),
		);

		// 4. Recent Transactions
		const recentTransactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: { transactionDate: "desc" },
			take: 5,
			include: { category: { select: { id: true, name: true, icon: true } } },
		});

		return c.json(
			{
				data: {
					currentBudget: currentBudgetStats,
					weeklySummary,
					categoryBreakdown: categoryBreakdown.sort(
						(a, b) => b.total - a.total,
					),
					recentTransactions,
				},
			},
			200,
		);
	});
