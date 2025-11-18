import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	await connectDB();
	const p = await Product.findById(params.id);
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(p);
}

export async function DELETE(request, { params }) {
	await connectDB();
	await Product.findByIdAndDelete(params.id);
	return NextResponse.json({ message: "Product deleted" });
}
