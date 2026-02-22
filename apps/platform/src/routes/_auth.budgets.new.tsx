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
						autoFillDates={{ start: "2026-02-17", end: "2026-02-23" }}
						onSuccess={() => navigate({ to: "/budgets" })}
					/>
				</div>
			</div>
		</div>
	);
}
