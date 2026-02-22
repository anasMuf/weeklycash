import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../features/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
		return {
			redirect: search.redirect as string | undefined,
		};
	},
	component: () => <LoginForm />,
});
