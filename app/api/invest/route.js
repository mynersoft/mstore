import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Invest from "@/models/Invest";

export async function GET() {
	try {
		await connectDB();

		const all = await Invest.find().sort({ createdAt: -1 });

		// Calculate total amount for tools
		const totalToolsInvest = all
			.filter((item) => item.investType === "tools")
			.reduce((sum, item) => sum + Number(item.amount || 0), 0);

		// Calculate total amount for malamal
		const totalMalamalInvest = all
			.filter((item) => item.investType === "malamal")
			.reduce((sum, item) => sum + Number(item.amount || 0), 0);

		return NextResponse.json({
			success: true,
			items: all,
			toolsAmount: totalToolsInvest,
			malamalsAmount: totalMalamalInvest,
		});
	} catch (e) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await connectDB();
		const body = await request.json();
		const created = await Invest.create(body);
		return NextResponse.json(created);
	} catch (e) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		await connectDB();
		const body = await request.json();
		const updated = await Invest.findByIdAndUpdate(body._id, body, {
			new: true,
		});
		return NextResponse.json(updated);
	} catch (e) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}

export async function DELETE(request) {
	try {
		await connectDB();
		const { id } = await request.json();
		await Invest.findByIdAndDelete(id);
		return NextResponse.json({ success: true });
	} catch (e) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
