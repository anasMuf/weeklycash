import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/core/layout/PageHeader";
import { BudgetForm } from "@/features/budgets/components/BudgetForm";
import {
	type Budget,
	BudgetList,
} from "@/features/budgets/components/BudgetList";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_auth/budgets/")({
	component: BudgetsPage,
});

interface RawBudget {
	id: string;
	amountLimit: number;
	startDate: string;
	endDate: string;
	spent: number;
	remaining: number;
	percentage: number;
}

function BudgetsPage() {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

	const { data: budgetResponse, isLoading } = useQuery({
		queryKey: ["budgets", "list"],
		queryFn: async () => {
			const res = await api.api.v1.budgets.$get({ query: {} });
			if (!res.ok) throw new Error("Failed to fetch budgets");
			return res.json() as Promise<{
				data: RawBudget[];
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
				<PageHeader title="Budget Mingguan" />
				<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
					<div className="w-full max-w-2xl animate-pulse space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-40 bg-muted rounded-xl w-full" />
						))}
					</div>
				</div>
			</div>
		);
	}

	const budgets = budgetResponse?.data || [];

	const handleEditClick = (budget: Budget) => {
		setSelectedBudget(budget);
		setIsEditOpen(true);
	};

	const today = new Date();
	const mappedBudgets = budgets.map((b: RawBudget): Budget => {
		const start = new Date(b.startDate);
		const end = new Date(b.endDate);
		return {
			id: b.id,
			limit: b.amountLimit,
			spent: b.spent,
			startDate: start.toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
			}),
			endDate: end.toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			isCurrentWeek: start <= today && end >= today,
			rawStartDate: b.startDate,
			rawEndDate: b.endDate,
		};
	});

	const hasCurrentWeekBudget = mappedBudgets.some((b) => b.isCurrentWeek);

	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title="Budget Mingguan"
				action={
					!hasCurrentWeekBudget && (
						<Button size="sm" className="gap-1 shadow-sm" asChild>
							<Link to="/budgets/new">
								<Plus className="h-4 w-4" />
								<span className="hidden sm:inline">Set Baru</span>
							</Link>
						</Button>
					)
				}
			/>

			<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
				<div className="w-full max-w-2xl">
					<BudgetList budgets={mappedBudgets} onEditClick={handleEditClick} />

					<Pagination className="mt-8 justify-center">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#" isActive>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>

			<Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
				<SheetContent className="w-full sm:max-w-md overflow-y-auto">
					<SheetHeader className="mb-6">
						<SheetTitle>
							Edit Budget ({selectedBudget?.startDate} -{" "}
							{selectedBudget?.endDate})
						</SheetTitle>
					</SheetHeader>
					{selectedBudget && (
						<BudgetForm
							initialData={{
								id: selectedBudget.id,
								limit: selectedBudget.limit,
								startDate: selectedBudget.rawStartDate.split("T")[0],
								endDate: selectedBudget.rawEndDate.split("T")[0],
							}}
							onSuccess={() => {
								setIsEditOpen(false);
							}}
						/>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}
