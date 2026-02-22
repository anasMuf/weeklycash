import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/core/layout/PageHeader";
import { BudgetOverview } from "@/features/dashboard/components/BudgetOverview";
import { CategoryChart } from "@/features/dashboard/components/CategoryChart";
import { RecentTransactionsList } from "@/features/dashboard/components/RecentTransactionsList";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";

export const Route = createFileRoute("/_auth/")({
	component: DashboardPage,
});

// Mock/Dummy Data
const MOCK_BUDGET = {
	limit: 700000,
	spent: 450000,
	remaining: 250000,
	startDate: "17 Feb",
	endDate: "23 Feb 2026",
};

const MOCK_SUMMARY = {
	income: 5000000,
	expense: 450000,
	transactionCount: 12,
};

const MOCK_CATEGORIES = [
	{ name: "Makanan & Minuman", value: 250000 },
	{ name: "Transportasi", value: 100000 },
	{ name: "Hiburan", value: 50000 },
	{ name: "Lainnya", value: 50000 },
];

const MOCK_TRANSACTIONS = [
	{
		id: "1",
		title: "Makan Siang Kopdar",
		amount: 75000,
		date: "22 Feb 2026",
		type: "EXPENSE" as const,
	},
	{
		id: "2",
		title: "Grab Bike ke Kantor",
		amount: 25000,
		date: "22 Feb 2026",
		type: "EXPENSE" as const,
	},
	{
		id: "3",
		title: "Freelance Project X",
		amount: 450000,
		date: "21 Feb 2026",
		type: "INCOME" as const,
	},
	{
		id: "4",
		title: "Kopi Kenangan",
		amount: 35000,
		date: "20 Feb 2026",
		type: "EXPENSE" as const,
	},
	{
		id: "5",
		title: "Langganan Netflix",
		amount: 54000,
		date: "19 Feb 2026",
		type: "EXPENSE" as const,
	},
];

function DashboardPage() {
	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title="Dashboard"
				action={
					<Button size="sm" className="hidden md:flex gap-1" asChild>
						{/* Use simple link or navigate logic to new transaction; routing will fail if path doesn't exist yet but we'll mock */}
						<div>
							<Plus className="h-4 w-4" />
							Baru
						</div>
					</Button>
				}
			/>

			<div className="flex-1 p-4 lg:p-6 space-y-6 max-w-6xl mx-auto w-full">
				<BudgetOverview budget={MOCK_BUDGET} />
				<SummaryCards
					income={MOCK_SUMMARY.income}
					expense={MOCK_SUMMARY.expense}
					transactionCount={MOCK_SUMMARY.transactionCount}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
					<div className="min-h-[350px]">
						<CategoryChart data={MOCK_CATEGORIES} />
					</div>
					<div className="min-h-[350px]">
						<RecentTransactionsList transactions={MOCK_TRANSACTIONS} />
					</div>
				</div>
			</div>
		</div>
	);
}
