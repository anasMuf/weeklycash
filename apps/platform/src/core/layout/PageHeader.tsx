export function PageHeader({
	title,
	action,
}: {
	title: string;
	action?: React.ReactNode;
}) {
	return (
		<header className="flex items-center justify-between p-4 border-b">
			<h1 className="text-xl font-semibold">{title}</h1>
			{action && <div>{action}</div>}
		</header>
	);
}
