import { connectDB } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	await connectDB();
	const p = await Category.findById(params.id);
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(p);
}




export async function PUT(req, { params }) {
	await connectDB();
	const { id } = params;
	const body = await req.json();

	const updated = await Category.findByIdAndUpdate(id, body, { new: true });
	return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
	await connectDB();
	const { id } = params;

	await Category.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}
