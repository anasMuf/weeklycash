import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { CategoryForm } from "./CategoryForm";

export interface Category {
	id: string;
	name: string;
	icon: string | null;
	type: "INCOME" | "EXPENSE";
	isDefault: boolean;
}

interface CategoryListProps {
	title: string;
	categories: Category[];
}

export function CategoryList({ title, categories }: CategoryListProps) {
	const queryClient = useQueryClient();
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.api.v1.categories[":id"].$delete({
				param: { id },
			});
			if (!res.ok) {
				const error = await res.json();
				// @ts-expect-error
				throw new Error(error.message || "Gagal menghapus kategori");
			}
			return res.json();
		},
		onSuccess: () => {
			toast.success("Kategori berhasil dihapus");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className="mb-8">
			<h2 className="text-lg font-semibold mb-4 border-b pb-2">{title}</h2>
			<div className="bg-card border rounded-lg shadow-sm">
				{categories.length === 0 ? (
					<div className="p-6 text-center text-muted-foreground text-sm">
						Belum ada kategori untuk tipe ini.
					</div>
				) : (
					<div className="divide-y divide-border/50">
						{categories.map((category) => (
							<div
								key={category.id}
								className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="text-2xl w-10 h-10 flex items-center justify-center bg-muted/60 rounded-full">
										{category.icon || "📦"}
									</div>
									<div className="flex flex-col">
										<span className="font-medium text-sm sm:text-base">
											{category.name}
										</span>
										<div className="mt-1">
											{category.isDefault ? (
												<Badge
													variant="secondary"
													className="text-[10px] font-normal px-1.5 h-4"
												>
													default
												</Badge>
											) : (
												<Badge
													variant="outline"
													className="text-[10px] font-normal px-1.5 h-4 border-primary/20 bg-primary/5 text-primary"
												>
													kustom
												</Badge>
											)}
										</div>
									</div>
								</div>

								{!category.isDefault && (
									<div className="flex items-center gap-1">
										<Dialog
											open={editingCategory?.id === category.id}
											onOpenChange={(open) => !open && setEditingCategory(null)}
										>
											<DialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 hover:bg-muted"
													onClick={() => setEditingCategory(category)}
												>
													<Pencil className="h-4 w-4" />
													<span className="sr-only">Edit</span>
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-md">
												<DialogHeader>
													<DialogTitle>Edit Kategori</DialogTitle>
												</DialogHeader>
												<CategoryForm
													initialData={{
														...category,
														icon: category.icon || "",
													}}
													onSuccess={() => setEditingCategory(null)}
													onCancel={() => setEditingCategory(null)}
												/>
											</DialogContent>
										</Dialog>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="h-4 w-4" />
													<span className="sr-only">Delete</span>
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Hapus kategori {category.name}?
													</AlertDialogTitle>
													<AlertDialogDescription>
														Apakah Anda yakin ingin menghapus kategori kustom
														ini? Jika kategori ini sedang dipakai pada
														transaksi, proses hapus akan gagal.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Batal</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
														onClick={() => deleteMutation.mutate(category.id)}
														disabled={deleteMutation.isPending}
													>
														{deleteMutation.isPending
															? "Menghapus..."
															: "Hapus Kategori"}
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
