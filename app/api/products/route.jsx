import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";


export async function GET(req) {
	await connectDB();
	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page")) || 1;
	const limit = parseInt(searchParams.get("limit")) || 10;

	const products = await Product.find()
		.skip((page - 1) * limit)
		.limit(limit);

	return NextResponse.json(products); // <-- return array directly
}


export async function POST(request) {
	await connectDB();
	const body = await request.json();
	const product = await Product.create(body);
	return NextResponse.json(product);
}

export async function PUT(request) {
	await connectDB();
	const body = await request.json();
	const updated = await Product.findByIdAndUpdate(body._id, body, {
		new: true,
	});
	return NextResponse.json(updated);
}

export async function DELETE(request) {
	await connectDB();
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	await Product.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}
