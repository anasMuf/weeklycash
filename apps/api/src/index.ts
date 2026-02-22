import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { budgetRoutes } from "./modules/budgets/budgets.routes.js";
import { categoryRoutes } from "./modules/categories/categories.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { transactionRoutes } from "./modules/transactions/transactions.routes.js";

const app = new Hono()
	.use(cors())
	.get("/", (c) => c.json({ message: "WeeklyCash API" }));

const routes = app
	.route("/api/v1/auth", authRoutes)
	.route("/api/v1/categories", categoryRoutes)
	.route("/api/v1/transactions", transactionRoutes)
	.route("/api/v1/budgets", budgetRoutes)
	.route("/api/v1/dashboard", dashboardRoutes);

export type AppType = typeof routes;

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
