import { z } from "zod";

export const createBudgetSchema = z.object({
	amountLimit: z.number().positive("Batas anggaran harus lebih dari 0"),
	startDate: z.string().refine((date) => {
		const dt = new Date(date);
		return !Number.isNaN(dt.getTime()) && dt.getDay() === 1; // 1 = Monday
	}, "Tanggal mulai harus hari Senin"),
	endDate: z.string().refine((date) => {
		const dt = new Date(date);
		return !Number.isNaN(dt.getTime()) && dt.getDay() === 0; // 0 = Sunday
	}, "Tanggal selesai harus hari Minggu"),
});

export const updateBudgetSchema = z.object({
	amountLimit: z.number().positive("Batas anggaran harus lebih dari 0"),
});

export const getBudgetsQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.transform((p) => (p ? parseInt(p, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((l) => (l ? parseInt(l, 10) : 10)),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type GetBudgetsQueryInput = z.infer<typeof getBudgetsQuerySchema>;
