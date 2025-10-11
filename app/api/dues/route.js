import { connectDB } from "@/lib/dbConnect";
import Due from "@/models/Due";
import { NextResponse } from "next/server";

// GET all dues
export async function GET() {
  await connectDB();
  const dues = await Due.find().sort({ date: -1 });
  return NextResponse.json(dues);
}

// POST new due
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const due = await Due.create(body);
  return NextResponse.json(due);
}