import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface BudgetFormData {
	id?: string;
	limit: number;
	startDate: string;
	endDate: string;
}

interface BudgetFormProps {
	initialData?: BudgetFormData;
	onSuccess?: () => void;
	autoFillDates?: { start: string; end: string };
}

export function BudgetForm({
	initialData,
	onSuccess,
	autoFillDates,
}: BudgetFormProps) {
	const [limit, setLimit] = useState<string>(
		initialData?.limit?.toString() || "",
	);
	const [startDate, setStartDate] = useState(
		initialData?.startDate ||
			autoFillDates?.start ||
			new Date().toISOString().split("T")[0],
	);
	const [endDate, setEndDate] = useState(
		initialData?.endDate ||
			autoFillDates?.end ||
			new Date().toISOString().split("T")[0],
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API req
		setTimeout(() => {
			setIsLoading(false);
			if (onSuccess) onSuccess();
		}, 600);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="limit">Batas Pengeluaran Minggu Ini</Label>
				<div className="relative">
					<span className="absolute left-3 top-2.5 font-medium text-muted-foreground mr-1">
						Rp
					</span>
					<Input
						id="limit"
						type="number"
						className="pl-10 font-mono text-lg"
						placeholder="0"
						value={limit}
						onChange={(e) => setLimit(e.target.value)}
						required
					/>
				</div>
			</div>

			<div className="space-y-4">
				<Label>Periode Minggu</Label>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor="startDate"
							className="text-xs text-muted-foreground"
						>
							Mulai (Senin)
						</Label>
						<Input
							id="startDate"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="endDate" className="text-xs text-muted-foreground">
							Selesai (Minggu)
						</Label>
						<Input
							id="endDate"
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							required
						/>
					</div>
				</div>
				<p className="text-xs text-muted-foreground border-l-2 border-primary/50 pl-2">
					Tanggal periode akan otomatis disesuaikan dari hari Senin ke Minggu.
				</p>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading
					? "Menyimpan..."
					: initialData
						? "Update Budget"
						: "Simpan Budget"}
			</Button>
		</form>
	);
}
