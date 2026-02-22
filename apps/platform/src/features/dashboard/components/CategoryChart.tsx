import { PieChart as PieChartIcon } from "lucide-react";
import { useMemo } from "react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/utils/format";

interface CategoryData {
	name: string;
	value: number;
}

interface CategoryChartProps {
	data: CategoryData[];
}

const COLORS = [
	"oklch(0.646 0.222 41.116)", // chart-1 (orange/red)
	"oklch(0.6 0.118 184.704)", // chart-2 (teal)
	"oklch(0.398 0.07 227.392)", // chart-3 (navy)
	"oklch(0.828 0.189 84.429)", // chart-4 (yellow)
	"oklch(0.769 0.188 70.08)", // chart-5 (orange)
	"oklch(0.627 0.265 303.9)", // purple
	"oklch(0.488 0.243 264.376)", // violet
];

export function CategoryChart({ data }: CategoryChartProps) {
	// biome-ignore lint/suspicious/noExplicitAny: recharts types are tricky with TooltipProps
	const renderCustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-card border border-border shadow-sm p-3 rounded-lg">
					<p className="font-semibold">{payload[0].name}</p>
					<p className="text-sm text-muted-foreground">
						{formatIDR(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	const sortedData = useMemo(() => {
		return [...data].sort((a, b) => b.value - a.value);
	}, [data]);

	return (
		<Card className="shadow-sm flex flex-col h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<PieChartIcon className="h-5 w-5 text-muted-foreground" />
					Breakdown Pengeluaran
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
				{data.length === 0 ? (
					<div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground">
						<PieChartIcon className="h-10 w-10 mb-2 opacity-20" />
						<p className="text-sm">Belum ada pengeluaran minggu ini</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%" minHeight={250}>
						<PieChart>
							<Pie
								data={sortedData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={2}
								dataKey="value"
							>
								{sortedData.map((_entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip content={renderCustomTooltip} />
							<Legend
								layout="horizontal"
								verticalAlign="bottom"
								align="center"
								wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
							/>
						</PieChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
