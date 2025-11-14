// app/api/stats/daily/route.js
import { connectDB } from "@/lib/dbConnect";
import SaleProfit from "@/models/SaleProfit";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();

		const start = new Date();
		start.setHours(0, 0, 0, 0);

		const end = new Date();
		end.setHours(23, 59, 59, 999);

		const sales = await SaleProfit.find({
			createdAt: { $gte: start, $lte: end },
		});

		const dailySale = sales.reduce((sum, s) => sum + s.totalSale, 0);
		const dailyProfit = sales.reduce((sum, s) => sum + s.profit, 0);

		return NextResponse.json({
			success: true,
			dailySale,
			dailyProfit,
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
