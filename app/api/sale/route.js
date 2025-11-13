
import { connectDB } from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import { NextResponse } from "next/server";

await connectDB();

export async function GET() {
	try {
		const sells = await Sale.find().sort({ createdAt: -1 }).limit(100);
		return NextResponse.json(sells); // send JSON response
	} catch (err) {
		console.error("Error fetching sales:", err);
		return NextResponse.json(
			{ message: "Error fetching sales", error: err.message },
			{ status: 500 }
		);
	}
}


export async function POST(req) {
	try {
		const data = await req.json();
		console.log("Incoming sale data:", data);

		if (!data.invoice || !data.items || !Array.isArray(data.items)) {
			console.log("Validation failed");
			return NextResponse.json(
				{ error: "Invoice and items are required" },
				{ status: 400 }
			);
		}

		const newSale = new Sale({
			customer: data.customer || { name: "Walk-in Customer", phone: "" },
			items: data.items,
			discount: data.discount || 0,
			subtotal: data.subtotal || 0,
			total: data.total || 0,
			invoice: data.invoice,
			date: data.date || new Date(),
		});

		await newSale.save();
		console.log("Sale saved:", newSale);

		return NextResponse.json(
			{ message: "Sale saved successfully", sale: newSale },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error saving sale:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
