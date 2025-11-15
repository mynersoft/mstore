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
	await connectDB();
	try {
		const url = new URL(req.url);
		const type = url.searchParams.get("type") || "daily"; // daily | weekly | monthly
		const page = parseInt(url.searchParams.get("page")) || 1;
		const limit = parseInt(url.searchParams.get("limit")) || 50;
		const skip = (page - 1) * limit;

		const filter = {};

		const now = new Date();
		let start, end;

		if (type === "daily") {
			start = new Date(now);
			start.setHours(0, 0, 0, 0);
			end = new Date(now);
			end.setHours(23, 59, 59, 999);
			filter.createdAt = { $gte: start, $lte: end };
		} else if (type === "weekly") {
			// get start of week (Sunday)
			const day = now.getDay(); // 0-6 (Sun-Sat)
			start = new Date(now);
			start.setDate(now.getDate() - day);
			start.setHours(0, 0, 0, 0);

			end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);

			filter.createdAt = { $gte: start, $lte: end };
		} else if (type === "monthly") {
			start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
			end = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
				23,
				59,
				59,
				999
			);
			filter.createdAt = { $gte: start, $lte: end };
		}

		const [records, total] = await Promise.all([
			ServiceRecords.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			ServiceRecords.countDocuments(filter),
		]);

		return NextResponse.json(
			{ success: true, list: records, total, page, limit },
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
