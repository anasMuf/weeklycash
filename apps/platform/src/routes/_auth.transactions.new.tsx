import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/core/layout/PageHeader";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";

export const Route = createFileRoute("/_auth/transactions/new")({
	component: NewTransactionPage,
});

function NewTransactionPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col flex-1">
			<PageHeader title="Tambah Transaksi" />

			<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
				<Card className="w-full max-w-lg shadow-sm border-border/50">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							Detail Transaksi
						</CardTitle>
					</CardHeader>
					<CardContent>
						<TransactionForm
							onSuccess={() => navigate({ to: "/transactions" })}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
