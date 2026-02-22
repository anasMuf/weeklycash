import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "../core/layout/AppLayout";
import { getApiBaseUrl } from "../utils/api";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ location }) => {
		// On server (SSR), skip — cookies not forwarded to API
		if (typeof window === "undefined") return;

		// Client-side navigation: verify auth cookie
		try {
			const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/me`, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Not authenticated");
		} catch {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
	},
	shouldReload: true,
	component: AuthLayout,
});

function AuthLayout() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Component-level guard: catches SSR hydration where beforeLoad was skipped
		fetch(`${getApiBaseUrl()}/api/v1/auth/me`, {
			credentials: "include",
		})
			.then((res) => {
				if (!res.ok) throw new Error("Not authenticated");
				setIsReady(true);
			})
			.catch(() => {
				window.location.href = "/login";
			});
	}, []);

	if (!isReady) return null;

	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
