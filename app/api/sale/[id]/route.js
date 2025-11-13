import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Sale from "@/models/Sale";

export async function GET(req, { params }) {
	await connectDB();
	const sale = await Sale.findById(params.id);
	return NextResponse.json(sale);
}
