import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { formatIDR } from "@/utils/format";

export interface Budget {
	id: string;
	limit: number;
	spent: number;
	startDate: string;
	endDate: string;
	isCurrentWeek: boolean;
	rawStartDate: string;
	rawEndDate: string;
}

interface BudgetListProps {
	budgets: Budget[];
	onEditClick?: (budget: Budget) => void;
}

export function BudgetList({ budgets, onEditClick }: BudgetListProps) {
	if (budgets.length === 0) {
		return (
			<EmptyState
				icon={Wallet}
				title="Belum ada history budget"
				description="Budget history akan muncul di sini setelah seminggu."
				className="max-w-2xl py-12"
			/>
		);
	}

	return (
		<div className="space-y-4 max-w-2xl">
			{budgets.map((budget) => {
				const percentage =
					budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
				const remaining = budget.limit - budget.spent;

				let statusBadge: React.ReactNode;
				let progressClass = "[&>div]:bg-budget-safe";

				if (percentage > 100) {
					statusBadge = (
						<Badge variant="destructive" className="ml-auto">
							🔴 Over Budget
						</Badge>
					);
					progressClass = "[&>div]:bg-budget-danger";
				} else if (budget.isCurrentWeek) {
					statusBadge = (
						<Badge className="ml-auto bg-blue-500 hover:bg-blue-600">
							AKTIF
						</Badge>
					);
					if (percentage >= 80) progressClass = "[&>div]:bg-budget-danger";
					else if (percentage >= 60)
						progressClass = "[&>div]:bg-budget-warning";
				} else {
					statusBadge = (
						<Badge
							variant="secondary"
							className="ml-auto bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
						>
							✅ On Track
						</Badge>
					);
					if (percentage >= 80) progressClass = "[&>div]:bg-budget-danger";
					else if (percentage >= 60)
						progressClass = "[&>div]:bg-budget-warning";
				}

				return (
					<Card
						key={budget.id}
						className={`overflow-hidden transition-all cursor-pointer hover:border-primary/40 ${budget.isCurrentWeek ? "border-primary/40 shadow-sm ring-1 ring-primary/10" : "opacity-90 hover:opacity-100"}`}
						onClick={() => onEditClick?.(budget)}
					>
						<CardContent className="p-5">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-base flex items-center gap-2">
									{budget.isCurrentWeek
										? "Minggu ini"
										: `${budget.startDate.split(" ")[0]}-${budget.endDate.split(" ")[0]} ${budget.startDate.split(" ")[1]}`}
									<span className="text-xs font-normal text-muted-foreground ml-1">
										({budget.startDate} — {budget.endDate})
									</span>
								</h3>
								{statusBadge}
							</div>

							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Limit:</span>
									<span className="font-medium">{formatIDR(budget.limit)}</span>
								</div>

								<Progress
									value={percentage > 100 ? 100 : percentage}
									className={`h-2 ${progressClass}`}
								/>

								<div className="flex justify-between items-center text-sm">
									<div className="flex gap-4">
										<span>
											<span className="text-muted-foreground mr-1">
												Terpakai:
											</span>
											<span className="font-medium text-foreground">
												{formatIDR(budget.spent)}
											</span>
										</span>
										<span
											className={
												remaining < 0
													? "text-destructive font-medium"
													: "text-foreground font-medium"
											}
										>
											<span className="text-muted-foreground mr-1 font-normal">
												Sisa:
											</span>
											{formatIDR(remaining)}
										</span>
									</div>
									<span
										className={`font-mono ${percentage > 100 ? "text-destructive font-bold" : "text-muted-foreground"}`}
									>
										{percentage.toFixed(0)}%
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
