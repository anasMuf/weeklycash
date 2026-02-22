import { prisma } from "../src/core/utils/prisma.js";
import { TransactionType } from "../src/generated/prisma/index.js";

async function main() {
	console.log("Starting seed...");

	// 1. Seed Categories Default
	const defaultCategories = [
		{
			name: "Makanan",
			type: TransactionType.EXPENSE,
			icon: "🍔",
			isDefault: true,
		},
		{
			name: "Transportasi",
			type: TransactionType.EXPENSE,
			icon: "🚗",
			isDefault: true,
		},
		{
			name: "Hiburan",
			type: TransactionType.EXPENSE,
			icon: "🎮",
			isDefault: true,
		},
		{
			name: "Tagihan",
			type: TransactionType.EXPENSE,
			icon: "🏠",
			isDefault: true,
		},
		{
			name: "Belanja",
			type: TransactionType.EXPENSE,
			icon: "🛒",
			isDefault: true,
		},
		{
			name: "Lainnya",
			type: TransactionType.EXPENSE,
			icon: "📦",
			isDefault: true,
		},
		{ name: "Gaji", type: TransactionType.INCOME, icon: "💰", isDefault: true },
		{
			name: "Freelance",
			type: TransactionType.INCOME,
			icon: "💼",
			isDefault: true,
		},
		{
			name: "Bonus",
			type: TransactionType.INCOME,
			icon: "🎁",
			isDefault: true,
		},
	];

	for (const cat of defaultCategories) {
		await prisma.category.create({
			data: cat,
		});
	}
	console.log("✅ Categories seeded");

	// 2. Seed 1 User Dummy
	const dummyUser = await prisma.user.create({
		data: {
			email: "user@example.com",
			passwordHash: "dummyhash123", // Will be hashed in actual implementation
			fullName: "John Doe",
		},
	});
	console.log("✅ User seeded:", dummyUser.email);

	// Get categories from DB
	const foodCat = await prisma.category.findFirst({
		where: { name: "Makanan" },
	});
	const salaryCat = await prisma.category.findFirst({
		where: { name: "Gaji" },
	});

	// 3. Seed Transactions Dummy
	await prisma.transaction.create({
		data: {
			userId: dummyUser.id,
			categoryId: salaryCat?.id,
			amount: 5000000,
			type: TransactionType.INCOME,
			transactionDate: new Date(),
			note: "Gaji Bulan Ini",
		},
	});

	await prisma.transaction.create({
		data: {
			userId: dummyUser.id,
			categoryId: foodCat?.id,
			amount: 50000,
			type: TransactionType.EXPENSE,
			transactionDate: new Date(),
			note: "Makan Siang",
		},
	});
	console.log("✅ Transactions seeded");

	// 4. Seed 1 Budget Minggu Ini
	const today = new Date();
	const day = today.getDay();
	const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
	const startOfWeek = new Date(today.setDate(diff));
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);

	await prisma.budget.create({
		data: {
			userId: dummyUser.id,
			amountLimit: 2000000,
			startDate: startOfWeek,
			endDate: endOfWeek,
		},
	});
	console.log("✅ Budget seeded");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
