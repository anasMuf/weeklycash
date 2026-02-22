import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/core/layout/PageHeader";
import { BudgetForm } from "@/features/budgets/components/BudgetForm";

export const Route = createFileRoute("/_auth/budgets/new")({
	component: NewBudgetPage,
});

function NewBudgetPage() {
	const navigate = useNavigate({ from: "/budgets/new" });

	const today = new Date();
	const day = today.getDay();
	const diff = today.getDate() - day + (day === 0 ? -6 : 1); // get Monday
	const monday = new Date(today.setDate(diff));
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	const autoFillDates = {
		start: monday.toISOString().split("T")[0],
		end: sunday.toISOString().split("T")[0],
	};

	return (
		<div className="flex flex-col flex-1 bg-muted/20">
			<PageHeader
				title="Set Budget Minggu Ini"
				action={
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted-foreground"
						asChild
					>
						<Link to="/budgets">
							<ArrowLeft className="h-4 w-4" />
							Kembali
						</Link>
					</Button>
				}
			/>

			<div className="flex-1 p-4 lg:p-6 w-full flex justify-center items-start pt-6 sm:pt-10">
				<div className="w-full max-w-lg bg-card rounded-xl border shadow-sm p-4 sm:p-6">
					<BudgetForm
						autoFillDates={autoFillDates}
						onSuccess={() => navigate({ to: "/budgets" })}
					/>
				</div>
			</div>
		</div>
	);
}
