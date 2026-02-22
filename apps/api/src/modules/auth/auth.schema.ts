import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email("Format email tidak valid"),
	password: z.string().min(8, "Password minimal 8 karakter"),
	fullName: z.string().optional(),
});

export const loginSchema = z.object({
	email: z.string().email("Format email tidak valid"),
	password: z.string(),
});

export const updateProfileSchema = z.object({
	fullName: z.string().min(1, "Nama lengkap tidak boleh kosong"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
