import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "../core/layout/AppLayout";

const API_BASE_URL =
	(typeof import.meta !== "undefined" &&
		// biome-ignore lint/suspicious/noExplicitAny: env var access
		(import.meta as any).env?.VITE_API_BASE_URL) ||
	"http://localhost:8000";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ location }) => {
		// On server (SSR), skip — cookies not forwarded to API
		if (typeof window === "undefined") return;

		// Client-side navigation: verify auth cookie
		try {
			const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
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
		fetch(`${API_BASE_URL}/api/v1/auth/me`, {
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
