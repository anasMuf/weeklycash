import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "../core/layout/AppLayout";

// Implement Jotai state access for actual auth checking down the line

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ location }) => {
		// Basic auth check logic (will be integrated with jotai later)
		const isClient = typeof window !== "undefined";
		const isAuthenticated = isClient
			? !!window.localStorage.getItem("token")
			: false;

		if (!isAuthenticated) {
			throw redirect({
				to: "/login", // Adjust as needed once login route exists
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
