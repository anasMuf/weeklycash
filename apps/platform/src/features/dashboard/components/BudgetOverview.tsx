import { AlertCircle, Target } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetOverviewProps {
	budget: {
		limit: number;
		spent: number;
		remaining: number;
		startDate: string;
		endDate: string;
	} | null;
}

export function BudgetOverview({ budget }: BudgetOverviewProps) {
	if (!budget) {
		return (
			<Alert className="mb-6 bg-primary/5 border-primary/20">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Belum ada budget minggu ini</AlertTitle>
				<AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<p>Tentukan batas pengeluaran Anda agar keuangan lebih terkontrol.</p>
					<Button size="sm">Set Budget Sekarang</Button>
				</AlertDescription>
			</Alert>
		);
	}

	const { limit, spent, remaining, startDate, endDate } = budget;
	const percentage = limit > 0 ? (spent / limit) * 100 : 0;

	let progressColorClass = "bg-budget-safe";
	let alertWarning = null;

	if (percentage >= 100) {
		progressColorClass = "bg-budget-danger animate-pulse";
		alertWarning = (
			<Alert variant="destructive" className="mt-4">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Over Budget!</AlertTitle>
				<AlertDescription>
					Pengeluaran Anda telah melebihi batas budget minggu ini.
				</AlertDescription>
			</Alert>
		);
	} else if (percentage >= 80) {
		progressColorClass = "bg-budget-danger";
		alertWarning = (
			<Alert
				variant="destructive"
				className="mt-4 border-destructive/50 bg-destructive/10 text-destructive"
			>
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Budget Hampir Habis!</AlertTitle>
				<AlertDescription>
					Sisa budget Anda tinggal sedikit. Mohon rem pengeluaran Anda.
				</AlertDescription>
			</Alert>
		);
	} else if (percentage >= 60) {
		progressColorClass = "bg-budget-warning";
	}

	const formatIDR = (value: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(value);

	return (
		<Card className="mb-6 shadow-sm">
			<CardHeader className="pb-3 border-b border-border/50">
				<div className="flex justify-between items-center w-full">
					<CardTitle className="text-lg font-semibold flex items-center gap-2">
						<Target className="h-5 w-5 text-primary" />
						Budget Minggu Ini
					</CardTitle>
					<span className="text-sm text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
						{startDate} — {endDate}
					</span>
				</div>
			</CardHeader>
			<CardContent className="pt-6">
				<div className="flex justify-between items-end mb-2">
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Terpakai
						</p>
						<p className="text-2xl font-bold tracking-tight">
							{formatIDR(spent)}
						</p>
					</div>
					<div className="text-right space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Dari Total
						</p>
						<p className="text-lg font-semibold text-muted-foreground">
							{formatIDR(limit)}
						</p>
					</div>
				</div>

				<div className="relative mt-4 mb-2">
					<Progress
						value={percentage > 100 ? 100 : percentage}
						className={`h-3 [&>div]:${progressColorClass}`}
					/>
				</div>

				<div className="flex justify-between items-center text-sm font-medium">
					<span className={percentage >= 100 ? "text-destructive" : ""}>
						Sisa: {formatIDR(remaining)}
					</span>
					<span
						className={
							percentage >= 100
								? "text-destructive"
								: percentage >= 80
									? "text-budget-danger"
									: "text-muted-foreground"
						}
					>
						{percentage.toFixed(0)}%
					</span>
				</div>

				{alertWarning}
			</CardContent>
		</Card>
	);
}
