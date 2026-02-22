import { z } from "zod";
import { TransactionType } from "../../generated/prisma/index.js";

// Queries params for GET /api/v1/transactions
export const getTransactionsQuerySchema = z.object({
	type: z.nativeEnum(TransactionType).optional(),
	categoryId: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	page: z
		.string()
		.optional()
		.transform((p) => (p ? parseInt(p, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((l) => (l ? parseInt(l, 10) : 10)),
	sort: z.string().default("transactionDate"), // "transactionDate" or others later
	order: z.enum(["asc", "desc"]).default("desc"),
});

// Schema for creating transaction
export const createTransactionSchema = z.object({
	amount: z.number().positive("Nominal harus lebih dari 0"),
	type: z.nativeEnum(TransactionType, {
		message: "Tipe harus INCOME atau EXPENSE",
	}),
	categoryId: z.string().min(1, "Kategori wajib dipilih"),
	transactionDate: z.string().refine((date) => {
		const dt = new Date(date);
		return !Number.isNaN(dt.getTime()) && dt <= new Date(); // Past dates or today only
	}, "Tanggal tidak valid atau di masa depan"),
	note: z.string().optional(),
});

// Schema for updating transaction (semua opsional)
export const updateTransactionSchema = z.object({
	amount: z.number().positive("Nominal harus lebih dari 0").optional(),
	type: z.nativeEnum(TransactionType).optional(),
	categoryId: z.string().optional(),
	transactionDate: z
		.string()
		.refine((date) => {
			const dt = new Date(date);
			return !Number.isNaN(dt.getTime()) && dt <= new Date();
		}, "Tanggal tidak valid atau di masa depan")
		.optional(),
	note: z.string().optional(),
});

export type GetTransactionsQueryInput = z.infer<
	typeof getTransactionsQuerySchema
>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
