import { connectDB } from "@/lib/dbConnect";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const bills = await Bill.find().sort({ createdAt: -1 });
    return NextResponse.json(bills);
}



export async function POST(req) {
    await connectDB();

    let data;
    try {
        data = await req.json();
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const { name, amount } = data;
    if (!name || amount == null) {
        return NextResponse.json(
            { error: "Missing fields" },
            { status: 400 }
        );
    }

    try {
        const bill = await Bill.create({ name, amount });
        return NextResponse.json(bill, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: "Database error: " + err.message },
            { status: 500 }
        );
    }
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