// app/api/service/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/dbConnect";
import ServiceRecords from "@/models/ServiceRecords";

/**
 * GET /api/service?date=YYYY-MM-DD&page=1&limit=20
 * POST /api/service
 */

export async function GET(req) {
    await connectDB()
	try {
		

		const url = new URL(req.url);
		const dateParam = url.searchParams.get("date"); // optional filter by date
		const page = parseInt(url.searchParams.get("page")) || 1;
		const limit = parseInt(url.searchParams.get("limit")) || 50;
		const skip = (page - 1) * limit;

		const filter = {};
		if (dateParam) {
			const d = new Date(dateParam);
			const start = new Date(d);
			start.setHours(0, 0, 0, 0);
			const end = new Date(d);
			end.setHours(23, 59, 59, 999);
			filter.createdAt = { $gte: start, $lte: end };
		}

		const [records, total] = await Promise.all([
			ServiceRecord.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			ServiceRecords.countDocuments(filter),
		]);

		return NextResponse.json(
			{ success: true, records, total, page, limit },
			{ status: 200 }
		);
	} catch (err) {
		console.error("GET /api/service error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
await connectDB();
	try {
		
		const body = await req.json();
		// validation (basic)
		const {
			servicingeDevice,
			customerName,
			phone,
			billAmount,
			warranty,
			notes,
		} = body;
		if (!servicingeDevice) {
			return NextResponse.json(
				{ success: false, message: "servicingeDevice is required" },
				{ status: 400 }
			);
		}

		const rec = await ServiceRecords.create({
			customerName,
			phone,
			servicingeDevice,
			billAmount: Number(billAmount) || 0,
			warranty: warranty || { hasWarranty: false, warrantyMonths: 0 },
			notes: notes || "",
		});

		return NextResponse.json(
			{ success: true, record: rec },
			{ status: 201 }
		);
	} catch (err) {
		console.error("POST /api/service error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
