import { atom } from "jotai";

// Auth state is now derived from the cookie (managed by the API server).
// This atom is only used for reactive UI updates after login/logout.
export const authAtom = atom<{
	isAuthenticated: boolean;
}>({
	isAuthenticated: false,
});

// Action atom for login/logout state changes
export const setAuthAtom = atom(null, (_get, set, isAuthenticated: boolean) => {
	set(authAtom, { isAuthenticated });
});
