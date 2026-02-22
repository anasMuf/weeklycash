import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/transactions/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_auth/transactions/new"!</div>;
}
