import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req) {
	try {
		await connectDB();

		const { searchParams } = new URL(req.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;

		const skip = (page - 1) * limit;

		const products = await Product.find()
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		return NextResponse.json(
			{
				success: true,
				products,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("GET products error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Server Error",
			},
			{ status: 500 }
		);
	}
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
