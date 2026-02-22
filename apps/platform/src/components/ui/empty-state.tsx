import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed bg-muted/20",
				className,
			)}
		>
			{Icon && (
				<div className="bg-muted p-4 rounded-full mb-4">
					<Icon className="h-8 w-8 text-muted-foreground animate-in zoom-in duration-500" />
				</div>
			)}
			<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
			{description && (
				<p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
					{description}
				</p>
			)}
			{action && <div className="mt-6">{action}</div>}
		</div>
	);
}
