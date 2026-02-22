import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { api } from "@/utils/api";

export interface TransactionFormData {
	id?: string;
	title: string;
	amount: number;
	date: string;
	type: "INCOME" | "EXPENSE";
	categoryId: string;
}

interface TransactionFormProps {
	initialData?: TransactionFormData;
	onSuccess?: () => void;
}

interface TransactionPayload {
	amount: number;
	type: "INCOME" | "EXPENSE";
	categoryId: string;
	transactionDate: string;
	note: string;
}

interface CategoryItem {
	id: string;
	name: string;
	icon: string | null;
	type: "INCOME" | "EXPENSE";
	isDefault: boolean;
}

export function TransactionForm({
	initialData,
	onSuccess,
}: TransactionFormProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [type, setType] = useState<"INCOME" | "EXPENSE">(
		initialData?.type || "EXPENSE",
	);
	const [amount, setAmount] = useState<string>(
		initialData?.amount?.toString() || "",
	);
	const [note, setNote] = useState(initialData?.title || "");
	const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
	const [date, setDate] = useState(
		initialData?.date || new Date().toISOString().split("T")[0],
	);

	// Fetch categories
	const { data: categoriesResponse } = useQuery({
		queryKey: ["categories", type],
		queryFn: async () => {
			const res = await api.api.v1.categories.$get({ query: { type } });
			if (!res.ok) throw new Error("Failed to fetch categories");
			return res.json() as Promise<{ data: CategoryItem[] }>;
		},
	});

	// Reset category when type changes if current category doesn't match type
	useEffect(() => {
		if (categoriesResponse?.data && categoryId) {
			const exists = categoriesResponse.data.some(
				(c: CategoryItem) => c.id === categoryId,
			);
			if (!exists) setCategoryId("");
		}
	}, [type, categoriesResponse, categoryId]);

	const transactionMutation = useMutation({
		mutationFn: async (payload: TransactionPayload) => {
			if (initialData?.id) {
				const res = await api.api.v1.transactions[":id"].$put({
					param: { id: initialData.id },
					json: payload,
				});
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || "Gagal memperbarui transaksi");
				}
				return res.json();
			}
			const res = await api.api.v1.transactions.$post({
				json: payload,
			});
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Gagal menyimpan transaksi");
			}
			return res.json();
		},
		onSuccess: () => {
			toast.success(
				initialData ? "Transaksi diperbarui" : "Transaksi berhasil disimpan",
			);
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
			if (onSuccess) onSuccess();
			else navigate({ to: "/transactions" });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!categoryId) {
			toast.error("Pilih kategori");
			return;
		}

		transactionMutation.mutate({
			amount: Number(amount),
			type,
			categoryId,
			transactionDate: new Date(date).toISOString(),
			note,
		});
	};

	const isLoading = transactionMutation.isPending;

	return (
		<form onSubmit={handleSubmit} className="space-y-6 px-4">
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
				<Select value={categoryId} onValueChange={setCategoryId}>
					<SelectTrigger id="category">
						<SelectValue placeholder="Pilih kategori" />
					</SelectTrigger>
					<SelectContent>
						{categoriesResponse?.data?.map((cat: CategoryItem) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.icon} {cat.name}
							</SelectItem>
						))}
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
					value={note}
					onChange={(e) => setNote(e.target.value)}
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
