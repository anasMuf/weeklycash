import { zValidator as honoZValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodError, ZodSchema } from "zod";

export const zValidator = <
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) => {
	return honoZValidator(target, schema, (result, c) => {
		if (!result.success) {
			const error = result.error as unknown as ZodError;
			const firstError = error.issues[0];

			return c.json(
				{
					success: false,
					message: firstError?.message || "Input tidak valid",
					errors: error.flatten().fieldErrors,
				},
				400,
			);
		}
	});
};
