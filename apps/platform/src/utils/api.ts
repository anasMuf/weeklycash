import type { AppType } from "api/src/index";
import { hc } from "hono/client";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error: Env var string type workaround
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create Hono RPS client instance
export const api = hc<AppType>(baseUrl, {
	headers: () => {
		// Attempt to get token dynamically on every request
		const isClient = typeof window !== "undefined";
		const token = isClient ? window.localStorage.getItem("token") : null;
		const headers: Record<string, string> = {};
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
		return headers;
	},
});
