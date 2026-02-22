import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface TransactionFormData {
	id?: string;
	title: string;
	amount: number;
	date: string;
	type: "INCOME" | "EXPENSE";
	category: string;
}

interface TransactionFormProps {
	initialData?: TransactionFormData;
	onSuccess?: () => void;
}

export function TransactionForm({
	initialData,
	onSuccess,
}: TransactionFormProps) {
	const [type, setType] = useState<"INCOME" | "EXPENSE">(
		initialData?.type || "EXPENSE",
	);
	const [amount, setAmount] = useState<string>(
		initialData?.amount?.toString() || "",
	);
	const [title, setTitle] = useState(initialData?.title || "");
	const [category, setCategory] = useState(initialData?.category || "");
	const [date, setDate] = useState(
		initialData?.date || new Date().toISOString().split("T")[0],
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate request
		setTimeout(() => {
			setIsLoading(false);
			if (onSuccess) onSuccess();
		}, 600);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-3">
				<Label>Tipe Transaksi</Label>
				<ToggleGroup
					type="single"
					value={type}
					onValueChange={(v) => v && setType(v as "INCOME" | "EXPENSE")}
					className="justify-start gap-2"
				>
					<ToggleGroupItem
						value="EXPENSE"
						aria-label="Toggle expense"
						className="border px-4 py-2 data-[state=on]:bg-expense/10 data-[state=on]:text-expense data-[state=on]:border-expense"
					>
						<ArrowUpRight className="mr-2 h-4 w-4" />
						Pengeluaran
					</ToggleGroupItem>
					<ToggleGroupItem
						value="INCOME"
						aria-label="Toggle income"
						className="border px-4 py-2 data-[state=on]:bg-income/10 data-[state=on]:text-income data-[state=on]:border-income"
					>
						<ArrowDownRight className="mr-2 h-4 w-4" />
						Pemasukan
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="space-y-2">
				<Label htmlFor="amount">Nominal</Label>
				<div className="relative">
					<span className="absolute left-3 top-2.5 font-medium text-muted-foreground mr-1">
						Rp
					</span>
					<Input
						id="amount"
						type="number"
						className="pl-10 font-mono text-lg"
						placeholder="0"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="category">Kategori</Label>
				<Select value={category} onValueChange={setCategory}>
					<SelectTrigger id="category">
						<SelectValue placeholder="Pilih kategori" />
					</SelectTrigger>
					<SelectContent>
						{type === "EXPENSE" ? (
							<>
								<SelectItem value="food">🍔 Makanan</SelectItem>
								<SelectItem value="transport">🚗 Transportasi</SelectItem>
								<SelectItem value="entertainment">🎮 Hiburan</SelectItem>
								<SelectItem value="bills">🏠 Tagihan</SelectItem>
							</>
						) : (
							<>
								<SelectItem value="salary">💰 Gaji</SelectItem>
								<SelectItem value="freelance">💼 Freelance</SelectItem>
								<SelectItem value="bonus">🎁 Bonus</SelectItem>
							</>
						)}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="date">Tanggal</Label>
				{/* Basic date picker using native date input for now */}
				<Input
					id="date"
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="note">Catatan (Opsional)</Label>
				<Textarea
					id="note"
					placeholder="Tulis catatan..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					rows={3}
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading
					? "Menyimpan..."
					: initialData
						? "Update Transaksi"
						: "Simpan Transaksi"}
			</Button>
		</form>
	);
}
