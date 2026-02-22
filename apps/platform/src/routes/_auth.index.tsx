import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/core/layout/PageHeader";
import { BudgetOverview } from "@/features/dashboard/components/BudgetOverview";
import { CategoryChart } from "@/features/dashboard/components/CategoryChart";
import { RecentTransactionsList } from "@/features/dashboard/components/RecentTransactionsList";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_auth/")({
	component: DashboardPage,
});

interface DashboardSummary {
	currentBudget: {
		amountLimit: number;
		spent: number;
		remaining: number;
		startDate: string;
		endDate: string;
	} | null;
	weeklySummary: {
		totalIncome: number;
		totalExpense: number;
		transactionCount: number;
	};
	categoryBreakdown: {
		name: string | null;
		total: number;
		percentage: number;
	}[];
	recentTransactions: {
		id: string;
		amount: string;
		type: string;
		transactionDate: string;
		note: string | null;
		category: {
			name: string;
		} | null;
	}[];
}

function DashboardPage() {
	const { data: summaryResponse, isLoading } = useQuery({
		queryKey: ["dashboard", "summary"],
		queryFn: async () => {
			const res = await api.api.v1.dashboard.summary.$get();
			if (!res.ok) throw new Error("Failed to fetch dashboard summary");
			return res.json() as Promise<{ data: DashboardSummary }>;
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1">
				<PageHeader title="Dashboard" />
				<div className="flex-1 p-4 lg:p-6 space-y-6 max-w-6xl mx-auto w-full animate-pulse">
					<div className="h-48 bg-muted rounded-xl" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="h-32 bg-muted rounded-xl" />
						<div className="h-32 bg-muted rounded-xl" />
						<div className="h-32 bg-muted rounded-xl" />
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="h-80 bg-muted rounded-xl" />
						<div className="h-80 bg-muted rounded-xl" />
					</div>
				</div>
			</div>
		);
	}

	const data = summaryResponse?.data;
	const budget = data?.currentBudget
		? {
				limit: data.currentBudget.amountLimit,
				spent: data.currentBudget.spent,
				remaining: data.currentBudget.remaining,
				// Format simple dates
				startDate: new Date(data.currentBudget.startDate)
					.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
					.replace(".", ""),
				endDate: new Date(data.currentBudget.endDate).toLocaleDateString(
					"id-ID",
					{ day: "numeric", month: "short", year: "numeric" },
				),
			}
		: null;

	const summaryCards = data?.weeklySummary || {
		totalIncome: 0,
		totalExpense: 0,
		transactionCount: 0,
	};

	const categoriesData = (data?.categoryBreakdown || []).map((c) => ({
		name: c.name || "N/A",
		value: c.total,
	}));

	const transactions = (data?.recentTransactions || []).map((t) => ({
		id: t.id,
		title: t.note || t.category?.name || "Transaksi",
		amount: Number(t.amount),
		date: new Date(t.transactionDate).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}),
		type: t.type as "INCOME" | "EXPENSE",
	}));

	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title="Dashboard"
				action={
					<Button size="sm" className="hidden md:flex gap-1" asChild>
						<Link to="/transactions/new">
							<Plus className="h-4 w-4" />
							Baru
						</Link>
					</Button>
				}
			/>

			<div className="flex-1 p-4 lg:p-6 space-y-6 max-w-6xl mx-auto w-full">
				<BudgetOverview budget={budget} />
				<SummaryCards
					income={summaryCards.totalIncome}
					expense={summaryCards.totalExpense}
					transactionCount={summaryCards.transactionCount}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
					<div className="min-h-[350px]">
						<CategoryChart data={categoriesData} />
					</div>
					<div className="min-h-[350px]">
						<RecentTransactionsList transactions={transactions} />
					</div>
				</div>
			</div>
		</div>
	);
}
