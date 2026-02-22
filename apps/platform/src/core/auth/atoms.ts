import { atom } from "jotai";

// Initialize with token from localStorage if available
const initialToken =
	typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

export const authAtom = atom<{
	token: string | null;
	isAuthenticated: boolean;
}>({
	token: initialToken,
	isAuthenticated: !!initialToken,
});

// A derived atom or action atom to set token
export const setAuthTokenAtom = atom(
	null,
	(_get, set, token: string | null) => {
		if (token) {
			window.localStorage.setItem("token", token);
			set(authAtom, { token, isAuthenticated: true });
		} else {
			window.localStorage.removeItem("token");
			set(authAtom, { token: null, isAuthenticated: false });
		}
	},
);
