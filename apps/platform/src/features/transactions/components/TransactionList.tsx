import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowUpRight,
	History,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { api } from "@/utils/api";
import { formatIDR } from "@/utils/format";

export interface Transaction {
	id: string;
	title: string;
	amount: number;
	date: string;
	type: "INCOME" | "EXPENSE";
	category: string;
	categoryId: string;
	rawDate: string;
	rawNote?: string;
}

interface TransactionListProps {
	transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
	const queryClient = useQueryClient();
	const [activeTx, setActiveTx] = useState<Transaction | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.api.v1.transactions[":id"].$delete({
				param: { id },
			});
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Gagal menghapus transaksi");
			}
			return res.json();
		},
		onMutate: async (id: string) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["transactions"] });

			// Snapshot the previous value
			const previousTransactions = queryClient.getQueryData([
				"transactions",
				"list",
			]);

			// Optimistically update to the new value
			queryClient.setQueryData(
				["transactions", "list"],
				(old: { data: { id: string }[] } | undefined) => {
					if (!old || !old.data) return old;
					return {
						...old,
						data: old.data.filter((tx) => tx.id !== id),
					};
				},
			);

			// Return a context object with the snapshotted value
			return { previousTransactions };
		},
		onError: (err, _, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousTransactions) {
				queryClient.setQueryData(
					["transactions", "list"],
					context.previousTransactions,
				);
			}
			toast.error(err.message);
		},
		onSuccess: () => {
			toast.success("Transaksi berhasil dihapus");
			queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
		},
		onSettled: () => {
			// Always refetch after error or success to ensure we are in sync with the server
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	return (
		<div className="space-y-4">
			<div className="rounded-md border bg-card/50 shadow-sm hidden md:block">
				{/* Desktop Table View */}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px]">Tgl</TableHead>
							<TableHead className="w-[150px]">Kategori</TableHead>
							<TableHead>Catatan</TableHead>
							<TableHead className="text-right">Nominal</TableHead>
							<TableHead className="w-[100px] text-right">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="py-12">
									<EmptyState
										icon={History}
										title="Belum ada transaksi"
										description="Coba ganti filter atau tambahkan transaksi baru."
										action={
											<Button asChild size="sm">
												<Link to="/transactions/new">
													<Plus className="h-4 w-4 mr-2" />
													Tambah Transaksi
												</Link>
											</Button>
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							transactions.map((tx) => (
								<TableRow key={tx.id}>
									<TableCell className="font-medium">{tx.date}</TableCell>
									<TableCell>
										<span className="flex items-center gap-2">
											<div
												className={`p-1.5 rounded-full ${tx.type === "INCOME" ? "bg-income/10" : "bg-expense/10"}`}
											>
												{tx.type === "INCOME" ? (
													<ArrowDownRight className="h-3 w-3 text-income" />
												) : (
													<ArrowUpRight className="h-3 w-3 text-expense" />
												)}
											</div>
											{tx.category}
										</span>
									</TableCell>
									<TableCell>{tx.title}</TableCell>
									<TableCell
										className={`text-right font-mono font-medium ${tx.type === "INCOME" ? "text-income" : "text-expense"}`}
									>
										{tx.type === "INCOME" ? "+" : "-"}
										{formatIDR(Math.abs(tx.amount))}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1 relative">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => {
													setActiveTx(tx);
													setIsEditOpen(true);
												}}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-destructive hover:text-destructive"
													>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">Delete</span>
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Yakin hapus transaksi ini?
														</AlertDialogTitle>
														<AlertDialogDescription>
															Tindakan ini tidak bisa dibatalkan. Transaksi akan
															dihapus permanen dari history pengeluaran Anda.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Batal</AlertDialogCancel>
														<AlertDialogAction
															className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															onClick={() => deleteMutation.mutate(tx.id)}
															disabled={deleteMutation.isPending}
														>
															{deleteMutation.isPending
																? "Menghapus..."
																: "Hapus"}
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Mobile Card View */}
			<div className="md:hidden">
				{transactions.length === 0 ? (
					<EmptyState
						icon={History}
						title="Belum ada transaksi"
						description="Coba ganti filter atau tambahkan transaksi baru."
						action={
							<Button asChild size="sm">
								<Link to="/transactions/new">
									<Plus className="h-4 w-4 mr-2" />
									Tambah Transaksi
								</Link>
							</Button>
						}
					/>
				) : (
					<div className="grid grid-cols-1 gap-3">
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="bg-card border rounded-lg p-4 shadow-sm flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div
										className={`p-2.5 rounded-full ${tx.type === "INCOME" ? "bg-income/10" : "bg-expense/10"}`}
									>
										{tx.type === "INCOME" ? (
											<ArrowDownRight className="h-5 w-5 text-income" />
										) : (
											<ArrowUpRight className="h-5 w-5 text-expense" />
										)}
									</div>
									<div>
										<p className="font-semibold text-sm">{tx.category}</p>
										<p className="text-xs text-muted-foreground">
											{tx.title} • {tx.date}
										</p>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<span
										className={`font-mono font-medium text-sm ${tx.type === "INCOME" ? "text-income" : "text-expense"}`}
									>
										{tx.type === "INCOME" ? "+" : "-"}
										{formatIDR(Math.abs(tx.amount))}
									</span>
									<div className="flex -mr-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => {
												setActiveTx(tx);
												setIsEditOpen(true);
											}}
										>
											<Pencil className="h-3 w-3" />
										</Button>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Hapus transaksi?</AlertDialogTitle>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Batal</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground"
														onClick={() => deleteMutation.mutate(tx.id)}
														disabled={deleteMutation.isPending}
													>
														{deleteMutation.isPending ? "Hapus..." : "Hapus"}
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
				<SheetContent
					className="w-full sm:max-w-md overflow-y-auto"
					side="right"
				>
					<SheetHeader className="mb-6">
						<SheetTitle>Edit Transaksi</SheetTitle>
					</SheetHeader>
					{activeTx && (
						<TransactionForm
							initialData={{
								id: activeTx.id,
								title: activeTx.rawNote || "",
								amount: activeTx.amount,
								date: activeTx.rawDate,
								type: activeTx.type,
								categoryId: activeTx.categoryId,
							}}
							onSuccess={() => setIsEditOpen(false)}
						/>
					)}
				</SheetContent>
			</Sheet>

			<Pagination className="justify-center sm:justify-end mt-4">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
