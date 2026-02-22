import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Settings, Tags, Target } from "lucide-react";

const NAV_ITEMS = [
	{
		title: "Dashboard",
		href: "/",
		icon: <LayoutDashboard className="h-6 w-6" />,
	},
	{
		title: "Transaksi",
		href: "/transactions",
		icon: <Receipt className="h-6 w-6" />,
	},
	{ title: "Budget", href: "/budgets", icon: <Target className="h-6 w-6" /> },
	{
		title: "Kategori",
		href: "/categories",
		icon: <Tags className="h-6 w-6" />,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: <Settings className="h-6 w-6" />,
	},
];

export function BottomNav() {
	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50 flex items-center justify-around px-2 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
			{NAV_ITEMS.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					activeProps={{ className: "text-primary -mt-1" }}
					className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-all duration-200"
				>
					{({ isActive }) => (
						<>
							<div
								className={`p-1 rounded-full transition-colors ${isActive ? "bg-primary/10" : ""}`}
							>
								{item.icon}
							</div>
							<span
								className={`text-[10px] mt-0.5 font-medium ${isActive ? "font-bold" : ""}`}
							>
								{item.title}
							</span>
						</>
					)}
				</Link>
			))}
		</nav>
	);
}
