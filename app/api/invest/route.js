import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Invest from "@/models/Invest";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const created = await Invest.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const all = await Invest.find().sort({ createdAt: -1 });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}