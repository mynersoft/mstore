import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Category from "@/models/Category";
import { connectDB } from "@/lib/dbConnect";

export async function GET() {
	try {
		if (!mongoose.connection.readyState) {
			await connectDB();
		}

		const categories = await Category.find().lean();
		return NextResponse.json(categories);
	} catch (err) {
		console.error("Error fetching categories:", err);
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	await connectDB();
	const body = await request.json();
	const category = await Category.create(body);
	return NextResponse.json(category);
}
