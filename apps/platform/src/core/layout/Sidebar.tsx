import { Link } from "@tanstack/react-router";
import {
	LayoutDashboard,
	Receipt,
	Settings,
	Tags,
	Target,
	Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
	{
		title: "Dashboard",
		href: "/",
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	{
		title: "Transaksi",
		href: "/transactions",
		icon: <Receipt className="h-5 w-5" />,
	},
	{ title: "Budget", href: "/budgets", icon: <Target className="h-5 w-5" /> },
	{
		title: "Kategori",
		href: "/categories",
		icon: <Tags className="h-5 w-5" />,
	},
];

export function Sidebar() {
	return (
		<aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 z-40 shadow-sm">
			<div className="p-6 pb-4">
				<div className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary">
					<div className="bg-primary/10 p-2 rounded-lg">
						<Wallet className="w-6 h-6" />
					</div>
					WeeklyCash
				</div>
			</div>

			<nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
				{NAV_ITEMS.map((item) => (
					<Link
						key={item.href}
						to={item.href}
						activeProps={{
							className: "bg-primary/10 text-primary font-semibold shadow-sm",
						}}
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
					>
						{item.icon}
						{item.title}
					</Link>
				))}
			</nav>

			<div className="p-4 mt-auto">
				<Separator className="mb-4" />
				<Link
					to="/settings"
					activeProps={{
						className: "bg-primary/10 text-primary font-semibold shadow-sm",
					}}
					className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all mb-2"
				>
					<Settings className="h-5 w-5" />
					Settings
				</Link>

				<div className="mt-2 flex items-center gap-3 px-3 py-2">
					<div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
						AM
					</div>
					<div className="flex flex-col overflow-hidden">
						<span className="text-sm font-semibold truncate leading-tight">
							Anas Mufti
						</span>
						<span className="text-xs text-muted-foreground truncate leading-tight">
							user@example.com
						</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
