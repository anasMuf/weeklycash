import { Link, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export function RegisterForm() {
	const navigate = useNavigate();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!fullName || !email || !password) {
			setError("Semua field harus diisi");
			return;
		}

		if (password.length < 8) {
			setError("Password setidaknya berjumlah 8 karakter");
			return;
		}

		setIsLoading(true);

		// Simulate network request
		setTimeout(() => {
			setIsLoading(false);
			// Simulate success -> Redirect to login
			// Actual Toast implementation will be hooked to jotai state or sonner API in the future
			console.log("Registered!");
			navigate({ to: "/login" });
		}, 1000);
	};

	return (
		<div className="flex h-screen w-full items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center items-center pb-8">
					<div className="bg-primary/10 p-3 rounded-full mb-3 flex items-center justify-center">
						<Wallet className="w-8 h-8 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">
						Daftar Akun Baru
					</CardTitle>
					<CardDescription>
						Mulai kendalikan pengeluaran Anda hari ini
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleRegister} className="space-y-4">
						{error && (
							<Alert variant="destructive" className="py-2 px-3 mb-2">
								<AlertDescription className="text-sm">{error}</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="fullName">Nama Lengkap</Label>
							<Input
								id="fullName"
								type="text"
								placeholder="Anas Mufti"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								required
								minLength={8}
							/>
						</div>
						<Button type="submit" className="w-full mt-2" disabled={isLoading}>
							{isLoading ? "Loading..." : "Daftar Sekarang"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center flex-col space-y-2 text-sm text-muted-foreground pb-6">
					<div>
						Sudah punya akun?{" "}
						<Link
							to="/login"
							className="font-semibold text-primary hover:underline"
						>
							Login di sini
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
