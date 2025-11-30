import connectDB from "@/utils/connectDB";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const bills = await Bill.find().sort({ createdAt: -1 });
    return NextResponse.json(bills);
}

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    if (!data.name || !data.amount) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const bill = await Bill.create(data);
    return NextResponse.json(bill);
}

export async function PUT(req) {
    await connectDB();
    const data = await req.json();
    if (!data._id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const updated = await Bill.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
}

export async function DELETE(req) {
    await connectDB();
    const data = await req.json();
    if (!data._id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await Bill.findByIdAndDelete(data._id);
    return NextResponse.json({ success: true });
}