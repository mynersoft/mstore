import { connectDB } from "@/lib/dbConnect";
import CustomerDue from "@/models/CustomerDue";
import { NextResponse } from "next/server";

// ✅ Get All Customers
export async function GET() {
  await connectDB();
  const dues = await CustomerDue.find().sort({ createdAt: -1 });
  return NextResponse.json(dues);
}

// ✅ Add New Customer Due
export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newDue = await CustomerDue.create(data);
  return NextResponse.json(newDue);
}