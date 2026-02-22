import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "../features/auth/components/LoginForm";
import { getApiBaseUrl } from "../utils/api";

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
		return {
			redirect: search.redirect as string | undefined,
		};
	},
	beforeLoad: async () => {
		// Guest-only: redirect to dashboard if already logged in
		if (typeof window === "undefined") return;

		try {
			const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/me`, {
				credentials: "include",
			});
			if (res.ok) {
				throw redirect({ to: "/" });
			}
		} catch (e) {
			// Re-throw redirect errors, ignore fetch errors (not authenticated = OK)
			if (e && typeof e === "object" && "to" in e) throw e;
		}
	},
	component: () => <LoginForm />,
});
