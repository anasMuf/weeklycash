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
import type { Budget } from "@/features/budgets/components/BudgetList";
import { BudgetList } from "@/features/budgets/components/BudgetList";

export const Route = createFileRoute("/_auth/budgets/")({
	component: BudgetsPage,
});

const MOCK_BUDGETS: Budget[] = [
	{
		id: "1",
		limit: 700000,
		spent: 450000,
		startDate: "17 Feb",
		endDate: "23 Feb 2026",
		isCurrentWeek: true,
	},
	{
		id: "2",
		limit: 700000,
		spent: 620000,
		startDate: "10 Feb",
		endDate: "16 Feb 2026",
		isCurrentWeek: false,
	},
	{
		id: "3",
		limit: 600000,
		spent: 750000,
		startDate: "3 Feb",
		endDate: "9 Feb 2026",
		isCurrentWeek: false,
	},
	{
		id: "4",
		limit: 500000,
		spent: 450000,
		startDate: "27 Jan",
		endDate: "2 Feb 2026",
		isCurrentWeek: false,
	},
];

function BudgetsPage() {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

	const handleEditClick = (budget: Budget) => {
		setSelectedBudget(budget);
		setIsEditOpen(true);
	};

	// We only show 'New' button if the current week budget is not found or not created yet
	const hasCurrentWeekBudget = MOCK_BUDGETS.some((b) => b.isCurrentWeek);

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
					<BudgetList budgets={MOCK_BUDGETS} onEditClick={handleEditClick} />

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
								<PaginationLink href="#">2</PaginationLink>
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
								// Mock mapping to ISO formats for native date inputs
								startDate: "2026-02-17",
								endDate: "2026-02-23",
							}}
							onSuccess={() => setIsEditOpen(false)}
						/>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}
