// app/api/service-records/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import ServiceRecord from "@/models/ServiceRecords";

export async function GET() {
  try {
    await connectDB();
    const records = await ServiceRecord.find().sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    // Basic server-side validation
    if (!body.customerName || !body.phone || !body.deviceName) {
      return NextResponse.json({ error: "customerName, phone and deviceName are required" }, { status: 400 });
    }

    const record = await ServiceRecord.create({
      customerName: body.customerName,
      phone: body.phone,
      deviceName: body.deviceName,
      billAmount: Number(body.billAmount) || 0,
      warranty: {
        hasWarranty: !!body.warranty?.hasWarranty,
        warrantyMonths: Number(body.warranty?.warrantyMonths) || 0,
      },
      notes: body.notes || "",
      receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(),
      status: body.status || "received",
    });

    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}