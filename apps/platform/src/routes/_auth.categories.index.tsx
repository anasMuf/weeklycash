import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/core/layout/PageHeader";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import {
	type Category,
	CategoryList,
} from "@/features/categories/components/CategoryList";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_auth/categories/")({
	component: CategoriesPage,
});

function CategoriesPage() {
	const [isNewOpen, setIsNewOpen] = useState(false);

	const { data: categoriesResponse, isLoading } = useQuery({
		queryKey: ["categories", "all"],
		queryFn: async () => {
			const res = await api.api.v1.categories.$get({ query: {} });
			if (!res.ok) throw new Error("Failed to fetch categories");
			return res.json() as Promise<{ data: Category[] }>;
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1">
				<PageHeader title="Kategori" />
				<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
					<div className="w-full max-w-2xl animate-pulse space-y-8">
						<div className="space-y-4">
							<div className="h-6 bg-muted rounded w-1/4" />
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-20 bg-muted rounded-xl w-full" />
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	const allCategories = categoriesResponse?.data || [];
	const expenseCategories = allCategories.filter(
		(c: Category) => c.type === "EXPENSE",
	);
	const incomeCategories = allCategories.filter(
		(c: Category) => c.type === "INCOME",
	);

	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title="Kategori"
				action={
					<Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
						<DialogTrigger asChild>
							<Button size="sm" className="gap-1 shadow-sm">
								<Plus className="h-4 w-4" />
								<span className="hidden sm:inline">Baru</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Tambah Kategori Baru</DialogTitle>
							</DialogHeader>
							<CategoryForm
								onSuccess={() => setIsNewOpen(false)}
								onCancel={() => setIsNewOpen(false)}
							/>
						</DialogContent>
					</Dialog>
				}
			/>

			<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
				<div className="w-full max-w-2xl">
					<CategoryList
						title="Pengeluaran (Expense)"
						categories={expenseCategories}
					/>
					<div className="mt-8">
						<CategoryList
							title="Pemasukan (Income)"
							categories={incomeCategories}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
