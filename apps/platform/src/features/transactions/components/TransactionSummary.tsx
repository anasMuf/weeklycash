import { Card, CardContent } from "@/components/ui/card";

interface TransactionSummaryProps {
	totalIncome: number;
	totalExpense: number;
}

export function TransactionSummary({
	totalIncome,
	totalExpense,
}: TransactionSummaryProps) {
	const formatIDR = (value: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(value);

	return (
		<Card className="mb-6 shadow-sm border-blue-100 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10">
			<CardContent className="p-4">
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-col sm:flex-row gap-1 sm:gap-4 flex-1">
						<div className="space-y-1">
							<p className="text-xs font-medium text-muted-foreground">
								Total Pemasukan
							</p>
							<p className="text-lg font-bold text-income">
								+{formatIDR(totalIncome)}
							</p>
						</div>

						{/* Separator on desktop */}
						<div className="hidden sm:block w-px bg-border my-2 mx-2"></div>

						<div className="space-y-1">
							<p className="text-xs font-medium text-muted-foreground">
								Total Pengeluaran
							</p>
							<p className="text-lg font-bold text-expense">
								-{formatIDR(totalExpense)}
							</p>
						</div>
					</div>
					<div className="text-right space-y-1 pl-4 border-l border-border">
						<p className="text-xs font-medium text-muted-foreground">
							Selisih (Net)
						</p>
						<p
							className={`text-lg font-bold ${totalIncome - totalExpense >= 0 ? "text-income" : "text-expense"}`}
						>
							{totalIncome - totalExpense >= 0 ? "+" : ""}
							{formatIDR(totalIncome - totalExpense)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
