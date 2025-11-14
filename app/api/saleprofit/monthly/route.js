// app/api/stats/monthly/route.js
import { connectDB } from "@/lib/dbConnect";
import SaleProfit from "@/models/SaleProfit";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();

		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		const end = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59
		);

		const sales = await SaleProfit.find({
			createdAt: { $gte: start, $lte: end },
		});

		const monthlySale = sales.reduce((sum, s) => sum + s.totalSale, 0);
		const monthlyProfit = sales.reduce((sum, s) => sum + s.profit, 0);

		return NextResponse.json({
			success: true,
			monthlySale,
			monthlyProfit,
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
