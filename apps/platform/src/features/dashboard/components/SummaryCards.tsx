import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CountUp } from "@/components/animations/CountUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardsProps {
	income: number;
	expense: number;
	transactionCount: number;
}

export function SummaryCards({
	income,
	expense,
	transactionCount,
}: SummaryCardsProps) {
	const formatIDR = (value: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(value);

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
					<div className="bg-income/10 p-2 rounded-full">
						<ArrowDownRight className="h-4 w-4 text-income" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-income">
						<CountUp value={income} formatter={formatIDR} />
					</div>
					<p className="text-xs text-muted-foreground mt-1">Total minggu ini</p>
				</CardContent>
			</Card>

			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
					<div className="bg-expense/10 p-2 rounded-full">
						<ArrowUpRight className="h-4 w-4 text-expense" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-expense">
						<CountUp value={Math.abs(expense)} formatter={formatIDR} />
					</div>
					<p className="text-xs text-muted-foreground mt-1">Total minggu ini</p>
				</CardContent>
			</Card>

			<Card className="shadow-sm hidden md:block">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
					<div className="bg-primary/10 p-2 rounded-full">
						<Activity className="h-4 w-4 text-primary" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<CountUp value={transactionCount} />
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						Aktivitas minggu ini
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
