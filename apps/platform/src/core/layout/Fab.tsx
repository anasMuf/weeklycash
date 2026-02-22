import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function Fab() {
	return (
		<Link
			to="/transactions/new"
			className="md:hidden fixed right-5 bottom-20 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95 transition-all duration-200"
			aria-label="Tambah Transaksi"
		>
			<Plus className="h-6 w-6" />
		</Link>
	);
}
