import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/utils/api";

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

interface CategoryPayload {
	name: string;
	type: "INCOME" | "EXPENSE";
	icon: string;
}

export function CategoryForm({
	initialData,
	onSuccess,
	onCancel,
}: CategoryFormProps) {
	const queryClient = useQueryClient();

	const [type, setType] = useState<"INCOME" | "EXPENSE">(
		initialData?.type || "EXPENSE",
	);
	const [name, setName] = useState(initialData?.name || "");
	const [icon, setIcon] = useState(initialData?.icon || "");

	const categoryMutation = useMutation({
		mutationFn: async (payload: CategoryPayload) => {
			if (initialData?.id) {
				const res = await api.api.v1.categories[":id"].$put({
					param: { id: initialData.id },
					json: payload,
				});
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || "Gagal memperbarui kategori");
				}
				return res.json();
			}
			const res = await api.api.v1.categories.$post({
				json: payload,
			});
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Gagal menambahkan kategori");
			}
			return res.json();
		},
		onSuccess: () => {
			toast.success(
				initialData ? "Kategori diperbarui" : "Kategori ditambahkan",
			);
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			if (onSuccess) onSuccess();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		categoryMutation.mutate({ name, type, icon });
	};

	const isLoading = categoryMutation.isPending;

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
