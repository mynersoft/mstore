import { connectDB } from "@/lib/dbConnect";
import Due from "@/models/Due";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();
  const updated = await Due.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  await Due.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}