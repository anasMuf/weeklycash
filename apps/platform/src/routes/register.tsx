import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { getApiBaseUrl } from "../utils/api";

export const Route = createFileRoute("/register")({
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
			if (e && typeof e === "object" && "to" in e) throw e;
		}
	},
	component: () => <RegisterForm />,
});
