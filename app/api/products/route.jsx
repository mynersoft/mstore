import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();
	const products = await Product.find().sort({ name: 1 });
	return NextResponse.json(products);
}

export async function POST(request) {
	const body = await request.json();
	await connectDB();
	const p = await Product.create(body);
	return NextResponse.json(p);
}
