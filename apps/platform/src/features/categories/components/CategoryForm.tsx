import { ArrowDownRight, ArrowUpRight, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface CategoryFormData {
	id?: string;
	name: string;
	type: "INCOME" | "EXPENSE";
	icon: string;
}

interface CategoryFormProps {
	initialData?: CategoryFormData;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function CategoryForm({
	initialData,
	onSuccess,
	onCancel,
}: CategoryFormProps) {
	const [type, setType] = useState<"INCOME" | "EXPENSE">(
		initialData?.type || "EXPENSE",
	);
	const [name, setName] = useState(initialData?.name || "");
	const [icon, setIcon] = useState(initialData?.icon || "");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			if (onSuccess) onSuccess();
		}, 600);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 pt-2">
			<div className="space-y-3">
				<Label>Tipe Kategori</Label>
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
				<Label htmlFor="name">Nama Kategori</Label>
				<Input
					id="name"
					placeholder="Contoh: Belanja Bulanan"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="icon">Ikon (Emoji)</Label>
				<div className="relative">
					<span className="absolute left-3 top-2.5 flex h-4 w-4 items-center justify-center text-muted-foreground">
						{icon ? icon : <Smile className="h-4 w-4" />}
					</span>
					<Input
						id="icon"
						className="pl-9 text-lg"
						placeholder="Pilih atau ketik emoji (🛒)"
						value={icon}
						onChange={(e) => setIcon(e.target.value)}
						maxLength={2}
						required
					/>
				</div>
				<p className="text-xs text-muted-foreground">
					Ganti emoji default dengan mengetik 1 karakter emoji.
				</p>
			</div>

			<div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
					>
						Batal
					</Button>
				)}
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Menyimpan..."
						: initialData
							? "Simpan Perubahan"
							: "Tambah Kategori"}
				</Button>
			</div>
		</form>
	);
}
