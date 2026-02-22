import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function TransactionFilter() {
	return (
		<div className="flex flex-col sm:flex-row gap-3 mb-4 mt-6">
			<div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 flex-1">
				<Select defaultValue="this-week">
					<SelectTrigger className="w-full sm:w-[140px]">
						<SelectValue placeholder="Waktu" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="this-week">Minggu ini</SelectItem>
						<SelectItem value="last-week">Minggu lalu</SelectItem>
						<SelectItem value="this-month">Bulan ini</SelectItem>
						<SelectItem value="custom">Kustom</SelectItem>
					</SelectContent>
				</Select>

				<Select defaultValue="all">
					<SelectTrigger className="w-full sm:w-[130px]">
						<SelectValue placeholder="Tipe" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Tipe</SelectItem>
						<SelectItem value="INCOME">Pemasukan</SelectItem>
						<SelectItem value="EXPENSE">Pengeluaran</SelectItem>
					</SelectContent>
				</Select>

				<Select defaultValue="all">
					<SelectTrigger className="col-span-2 sm:col-span-1 w-full sm:w-[150px]">
						<SelectValue placeholder="Kategori" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Kategori</SelectItem>
						{/* Example Mock Categories */}
						<SelectItem value="food">Makanan</SelectItem>
						<SelectItem value="transport">Transportasi</SelectItem>
						<SelectItem value="salary">Gaji</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="relative w-full sm:w-[250px] shrink-0">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input type="search" placeholder="Cari transaksi..." className="pl-8" />
			</div>
		</div>
	);
}
