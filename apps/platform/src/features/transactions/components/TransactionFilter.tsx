import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";

interface TransactionFilterProps {
	search: string;
	onSearchChange: (value: string) => void;
	type: string;
	onTypeChange: (value: string) => void;
	categoryId: string;
	onCategoryIdChange: (value: string) => void;
}

export function TransactionFilter({
	search,
	onSearchChange,
	type,
	onTypeChange,
	categoryId,
	onCategoryIdChange,
}: TransactionFilterProps) {
	const { data: categoryResponse } = useQuery({
		queryKey: ["categories", "list"],
		queryFn: async () => {
			const res = await api.api.v1.categories.$get({ query: {} });
			if (!res.ok) throw new Error("Failed to fetch categories");
			return res.json();
		},
	});

	const categories = categoryResponse?.data || [];

	return (
		<div className="flex flex-col sm:flex-row gap-3 mb-4 mt-6">
			<div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 flex-1">
				<Select value={type} onValueChange={onTypeChange}>
					<SelectTrigger className="w-full sm:w-[130px]">
						<SelectValue placeholder="Tipe" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Tipe</SelectItem>
						<SelectItem value="INCOME">Pemasukan</SelectItem>
						<SelectItem value="EXPENSE">Pengeluaran</SelectItem>
					</SelectContent>
				</Select>

				<Select value={categoryId} onValueChange={onCategoryIdChange}>
					<SelectTrigger className="col-span-2 sm:col-span-1 w-full sm:w-[180px]">
						<SelectValue placeholder="Kategori" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Kategori</SelectItem>
						{categories.map(
							(cat: { id: string; name: string; icon: string | null }) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.icon} {cat.name}
								</SelectItem>
							),
						)}
					</SelectContent>
				</Select>
			</div>

			<div className="relative w-full sm:w-[250px] shrink-0">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Cari transaksi..."
					className="pl-8"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>
		</div>
	);
}
