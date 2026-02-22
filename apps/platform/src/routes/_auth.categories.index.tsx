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
import type { Category } from "@/features/categories/components/CategoryList";
import { CategoryList } from "@/features/categories/components/CategoryList";

export const Route = createFileRoute("/_auth/categories/")({
	component: CategoriesPage,
});

const MOCK_CATEGORIES: Category[] = [
	{
		id: "1",
		name: "Makanan & Minuman",
		icon: "🍔",
		type: "EXPENSE",
		isDefault: true,
	},
	{
		id: "2",
		name: "Transportasi",
		icon: "🚗",
		type: "EXPENSE",
		isDefault: true,
	},
	{ id: "3", name: "Hiburan", icon: "🎮", type: "EXPENSE", isDefault: true },
	{ id: "4", name: "Tagihan", icon: "🏠", type: "EXPENSE", isDefault: true },
	{ id: "5", name: "Belanja", icon: "🛒", type: "EXPENSE", isDefault: true },
	{ id: "6", name: "Lainnya", icon: "📦", type: "EXPENSE", isDefault: true },
	{
		id: "7",
		name: "Kopi Hitam",
		icon: "☕",
		type: "EXPENSE",
		isDefault: false,
	},

	{ id: "101", name: "Gaji", icon: "💰", type: "INCOME", isDefault: true },
	{ id: "102", name: "Freelance", icon: "💼", type: "INCOME", isDefault: true },
	{ id: "103", name: "Bonus", icon: "🎁", type: "INCOME", isDefault: true },
	{
		id: "104",
		name: "Side Hustle",
		icon: "💻",
		type: "INCOME",
		isDefault: false,
	},
];

function CategoriesPage() {
	const [isNewOpen, setIsNewOpen] = useState(false);

	const expenseCategories = MOCK_CATEGORIES.filter((c) => c.type === "EXPENSE");
	const incomeCategories = MOCK_CATEGORIES.filter((c) => c.type === "INCOME");

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
					<CategoryList
						title="Pemasukan (Income)"
						categories={incomeCategories}
					/>
				</div>
			</div>
		</div>
	);
}
