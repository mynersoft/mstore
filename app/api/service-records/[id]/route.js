// app/api/service-records/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import ServiceRecord from "@/models/ServiceRecord";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const rec = await ServiceRecord.findById(params.id);
    if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rec);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectDB();
    const updated = await ServiceRecord.findByIdAndUpdate(
      params.id,
      {
        customerName: body.customerName,
        phone: body.phone,
        deviceName: body.deviceName,
        billAmount: Number(body.billAmount) || 0,
        warranty: {
          hasWarranty: !!body.warranty?.hasWarranty,
          warrantyMonths: Number(body.warranty?.warrantyMonths) || 0,
        },
        notes: body.notes || "",
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
        status: body.status,
      },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const deleted = await ServiceRecord.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}