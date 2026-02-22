import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { Lock, LogOut } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setAuthTokenAtom } from "@/core/auth/atoms";

export function SettingsForm() {
	const navigate = useNavigate();
	const setAuthToken = useSetAtom(setAuthTokenAtom);

	const [name, setName] = useState("Anas Mufti");
	const [isLoading, setIsLoading] = useState(false);
	const email = "user@example.com"; // Readonly mock data

	const handleSave = (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API Call
		setTimeout(() => {
			setIsLoading(false);
			// toast("Profil berhasil diupdate")
		}, 800);
	};

	const handleLogout = () => {
		// Clear auth token and redirect to login
		setAuthToken(null);
		navigate({ to: "/login" });
	};

	return (
		<div className="space-y-6 w-full max-w-lg mx-auto">
			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle>Profil</CardTitle>
					<CardDescription>
						Perbarui informasi akun Anda di sini.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="profile-form" onSubmit={handleSave} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nama Lengkap</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Input
									id="email"
									type="email"
									value={email}
									disabled
									className="bg-muted text-muted-foreground pr-10"
								/>
								<Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
							</div>
							<p className="text-[0.8rem] text-muted-foreground">
								Email tidak dapat diubah.
							</p>
						</div>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						form="profile-form"
						disabled={isLoading}
						className="w-full sm:w-auto"
					>
						{isLoading ? "Menyimpan..." : "Simpan Perubahan"}
					</Button>
				</CardFooter>
			</Card>

			<Separator />

			<div className="flex flex-col space-y-3">
				<div>
					<h3 className="text-lg font-medium text-destructive">Zona Bahaya</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Keluar dari akun Anda pada perangkat ini.
					</p>
				</div>
				<Button
					variant="outline"
					className="w-full sm:w-auto self-start text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
					onClick={handleLogout}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</Button>
			</div>
		</div>
	);
}
