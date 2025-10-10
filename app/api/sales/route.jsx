import { connectDB } from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();
	const sales = await Sale.find().sort({ date: -1 });
	return NextResponse.json(sales);
}

export async function POST(request) {
	const body = await request.json();
	await connectDB();
	// body: { productId, qty, price }
	const total = body.qty * body.price;
	const sale = await Sale.create({ ...body, total });
	// update product stock and sold
	await Product.findByIdAndUpdate(body.productId, {
		$inc: { sold: body.qty, stock: -body.qty },
	});
	return NextResponse.json(sale);
}
