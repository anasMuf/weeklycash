import { Link } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

interface Transaction {
	id: string;
	title: string;
	amount: number;
	date: string;
	type: "INCOME" | "EXPENSE";
	icon?: string;
}

interface RecentTransactionsListProps {
	transactions: Transaction[];
}

export function RecentTransactionsList({
	transactions,
}: RecentTransactionsListProps) {
	const formatIDR = (value: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(value);

	return (
		<Card className="shadow-sm flex flex-col h-full">
			<CardHeader className="pb-3 border-b border-border/50">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<History className="h-5 w-5 text-muted-foreground" />
					Transaksi Terakhir
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col p-0 text-center">
				{transactions.length === 0 ? (
					<div className="p-8 flex-1 flex flex-col items-center justify-center">
						<EmptyState
							icon={History}
							title="Belum ada transaksi"
							description="Mulai catat pengeluaran atau pemasukan Anda hari ini."
							className="border-none bg-transparent p-0"
						/>
					</div>
				) : (
					<div className="divide-y divide-border/50">
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${tx.type === "INCOME" ? "bg-income/10" : "bg-expense/10"}`}
									>
										{tx.type === "INCOME" ? (
											<ArrowDownRight className="h-4 w-4 text-income" />
										) : (
											<ArrowUpRight className="h-4 w-4 text-expense" />
										)}
									</div>
									<div>
										<p className="text-sm font-medium leading-none mb-1">
											{tx.title}
										</p>
										<p className="text-xs text-muted-foreground">{tx.date}</p>
									</div>
								</div>
								<div
									className={`font-mono font-medium ${tx.type === "INCOME" ? "text-income" : "text-expense"}`}
								>
									{tx.type === "INCOME" ? "+" : "-"}
									{formatIDR(Math.abs(tx.amount))}
								</div>
							</div>
						))}
					</div>
				)}
				<div className="p-4 mt-auto border-t border-border/50">
					<Button
						variant="outline"
						className="w-full text-sm flex items-center gap-2 group"
						asChild
					>
						<Link to="/transactions">
							Lihat Semua Transaksi
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
