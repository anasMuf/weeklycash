import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
	title,
	action,
	showBack,
}: {
	title: string;
	action?: React.ReactNode;
	showBack?: boolean;
}) {
	const navigate = useNavigate();

	return (
		<header className="flex items-center justify-between p-4 border-b">
			<div className="flex items-center gap-2">
				{showBack && (
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 -ml-2"
						onClick={() => navigate({ to: ".." })}
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="sr-only">Kembali</span>
					</Button>
				)}
				<h1 className="text-xl font-semibold">{title}</h1>
			</div>
			{action && <div>{action}</div>}
		</header>
	);
}
