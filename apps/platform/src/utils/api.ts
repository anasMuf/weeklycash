import type { AppType } from "api/src/index";
import { hc } from "hono/client";

const baseUrl =
	(typeof import.meta !== "undefined" &&
		// biome-ignore lint/suspicious/noExplicitAny: env var access
		(import.meta as any).env?.VITE_API_BASE_URL) ||
	"http://localhost:8000";

// Create Hono RPC client instance with cookie credentials
export const api = hc<AppType>(baseUrl, {
	fetch: (input: RequestInfo | URL, init?: RequestInit) =>
		fetch(input, {
			...init,
			credentials: "include",
		}),
});
