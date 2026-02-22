import { Link, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
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
import { api, getApiBaseUrl } from "@/utils/api";

export function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	// Guest-only guard: redirect if already authenticated
	useEffect(() => {
		fetch(`${getApiBaseUrl()}/api/v1/auth/me`, { credentials: "include" })
			.then((res) => {
				if (res.ok) {
					window.location.href = "/";
				} else {
					setIsChecking(false);
				}
			})
			.catch(() => setIsChecking(false));
	}, []);

	if (isChecking) return null;

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Email dan password harus diisi");
			return;
		}

		setIsLoading(true);

		try {
			const res = await api.api.v1.auth.login.$post({
				json: { email, password },
			});

			if (res.ok) {
				// Cookie is set automatically by the API response.
				// Just redirect to dashboard.
				navigate({ to: "/" });
			} else {
				const errorData = await res.json();
				setError(errorData.message || "Email atau password salah");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("Gagal menghubungi server. Pastikan API menyala.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen w-full items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center items-center pb-8">
					<div className="bg-primary/10 p-3 rounded-full mb-3 flex items-center justify-center">
						<Wallet className="w-8 h-8 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">
						WeeklyCash
					</CardTitle>
					<CardDescription>
						Masuk ke akun Anda untuk atur keuangan
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						{error && (
							<Alert variant="destructive" className="py-2 px-3 mb-2">
								<AlertDescription className="text-sm">{error}</AlertDescription>
							</Alert>
						)}
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
							/>
						</div>
						<Button type="submit" className="w-full mt-2" disabled={isLoading}>
							{isLoading ? "Loading..." : "Login"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center flex-col space-y-2 text-sm text-muted-foreground pb-6">
					<div>
						Belum punya akun?{" "}
						<Link
							to="/register"
							className="font-semibold text-primary hover:underline"
						>
							Daftar di sini
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
