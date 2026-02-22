import { z } from "zod";
import { TransactionType } from "../../generated/prisma/index.js";

export const createCategorySchema = z.object({
	name: z.string().min(1, "Nama kategori wajib diisi"),
	type: z.nativeEnum(TransactionType, {
		message: "Tipe harus berupa INCOME atau EXPENSE",
	}),
	icon: z.string().optional(),
});

export const updateCategorySchema = z.object({
	name: z.string().min(1, "Nama kategori tidak boleh kosong").optional(),
	icon: z.string().optional(),
	// Tidak mengizinkan update tipe transaksi untuk mencegah inkonsistensi
});

export const getCategoryQuerySchema = z.object({
	type: z.nativeEnum(TransactionType).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
