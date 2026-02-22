import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/core/layout/PageHeader";
import { TransactionFilter } from "@/features/transactions/components/TransactionFilter";
import { TransactionList } from "@/features/transactions/components/TransactionList";
import { TransactionSummary } from "@/features/transactions/components/TransactionSummary";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_auth/transactions/")({
	component: TransactionsPage,
});

interface RawTransaction {
	id: string;
	amount: string;
	type: string;
	transactionDate: string;
	note: string | null;
	categoryId: string;
	category: {
		id: string;
		name: string;
		icon: string | null;
	} | null;
}

function TransactionsPage() {
	const { data: txResponse, isLoading } = useQuery({
		queryKey: ["transactions", "list"],
		queryFn: async () => {
			const res = await api.api.v1.transactions.$get({ query: {} });
			if (!res.ok) throw new Error("Failed to fetch transactions");
			return res.json() as Promise<{
				data: RawTransaction[];
				meta: {
					page: number;
					limit: number;
					total: number;
					totalPages: number;
				};
			}>;
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1">
				<PageHeader title="Transaksi" />
				<div className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full animate-pulse space-y-4">
					<div className="h-10 bg-muted rounded w-full" />
					<div className="h-20 bg-muted rounded w-full" />
					<div className="space-y-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-16 bg-muted rounded w-full" />
						))}
					</div>
				</div>
			</div>
		);
	}

	const transactions = txResponse?.data || [];

	const totalIncome = transactions
		.filter((t: RawTransaction) => t.type === "INCOME")
		.reduce(
			(acc: number, curr: RawTransaction) => acc + Number(curr.amount),
			0,
		);

	const totalExpense = transactions
		.filter((t: RawTransaction) => t.type === "EXPENSE")
		.reduce(
			(acc: number, curr: RawTransaction) => acc + Number(curr.amount),
			0,
		);

	const mappedTransactions = transactions.map((t: RawTransaction) => ({
		id: t.id,
		title: t.note || t.category?.name || "Transaksi",
		amount: Number(t.amount),
		date: new Date(t.transactionDate).toLocaleDateString("id-ID"),
		type: t.type as "INCOME" | "EXPENSE",
		category: `${t.category?.icon || "📦"} ${t.category?.name || "Lainnya"}`,
		categoryId: t.categoryId,
		rawDate: t.transactionDate.split("T")[0],
		rawNote: t.note ?? undefined,
	}));

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
				<TransactionSummary
					totalIncome={totalIncome}
					totalExpense={totalExpense}
				/>
				<TransactionList transactions={mappedTransactions} />
			</div>
		</div>
	);
}
