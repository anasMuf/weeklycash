/**
 * Format angka ke format mata uang Rupiah Indonesia (IDR).
 * Contoh: 75000 → "Rp75.000"
 */
export function formatIDR(value: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value);
}

/**
 * Format string angka dengan pemisah ribuan titik untuk input field.
 * Contoh: "75000" → "75.000", "1500000" → "1.500.000"
 */
export function formatInputIDR(value: string): string {
	const digits = value.replace(/\D/g, "");
	if (!digits) return "";
	return Number(digits).toLocaleString("id-ID");
}

/**
 * Parse string berformat ribuan kembali ke number.
 * Contoh: "75.000" → 75000, "1.500.000" → 1500000
 */
export function parseInputIDR(value: string): number {
	return Number(value.replace(/\D/g, "")) || 0;
}
