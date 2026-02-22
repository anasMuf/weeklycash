import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/core/layout/PageHeader";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export const Route = createFileRoute("/_auth/settings/")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div className="flex flex-col flex-1">
			<PageHeader title="Pengaturan" />

			<div className="flex-1 p-4 lg:p-6 w-full flex flex-col items-center">
				<SettingsForm />
			</div>
		</div>
	);
}
