import { connectDB } from "@/lib/dbConnect";
import CustomerDue from "@/models/Due";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await CustomerDue.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await CustomerDue.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted successfully" });
}