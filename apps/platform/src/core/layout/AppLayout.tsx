import type React from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-background text-foreground">
			<Sidebar />
			<main className="flex-1 pb-16 md:pb-0 relative flex flex-col">
				{children}
			</main>
			<BottomNav />
		</div>
	);
}
