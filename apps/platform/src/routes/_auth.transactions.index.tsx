import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/core/layout/PageHeader";
import { TransactionFilter } from "@/features/transactions/components/TransactionFilter";
import type { Transaction } from "@/features/transactions/components/TransactionList";
import { TransactionList } from "@/features/transactions/components/TransactionList";
import { TransactionSummary } from "@/features/transactions/components/TransactionSummary";

export const Route = createFileRoute("/_auth/transactions/")({
	component: TransactionsPage,
});

const MOCK_TRANSACTIONS: Transaction[] = [
	{
		id: "1",
		title: "Makan Siang Kopdar",
		amount: 75000,
		date: "22/02/2026",
		type: "EXPENSE",
		category: "🍔 Makanan",
	},
	{
		id: "2",
		title: "Grab Bike ke Kantor",
		amount: 25000,
		date: "22/02/2026",
		type: "EXPENSE",
		category: "🚗 Transportasi",
	},
	{
		id: "3",
		title: "Freelance Project X",
		amount: 5000000,
		date: "21/02/2026",
		type: "INCOME",
		category: "💰 Freelance",
	},
	{
		id: "4",
		title: "Kopi Kenangan",
		amount: 35000,
		date: "21/02/2026",
		type: "EXPENSE",
		category: "🍔 Makanan",
	},
	{
		id: "5",
		title: "Langganan Netflix",
		amount: 54000,
		date: "20/02/2026",
		type: "EXPENSE",
		category: "🎮 Hiburan",
	},
];

function TransactionsPage() {
	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title="Transaksi"
				action={
					<Button size="sm" className="gap-1 shadow-sm" asChild>
						<Link to="/transactions/new">
							<Plus className="h-4 w-4" />
							<span className="hidden sm:inline">Baru</span>
						</Link>
					</Button>
				}
			/>

			<div className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
				<TransactionFilter />
				<TransactionSummary totalIncome={5000000} totalExpense={450000} />
				<TransactionList transactions={MOCK_TRANSACTIONS} />
			</div>
		</div>
	);
}
