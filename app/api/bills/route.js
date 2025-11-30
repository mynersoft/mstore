import { connectDB } from "@/lib/dbConnect";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";

// Utility: Send Error (Automatically logs + sends JSON)
function sendError(error, status = 500) {
    console.error("API ERROR:", error); // <-- Console log
    return NextResponse.json(
        { error: error?.message || error },
        { status }
    );
}

export async function GET() {
    try {
        await connectDB();
        const bills = await Bill.find().sort({ createdAt: -1 });
        return NextResponse.json(bills);
    } catch (error) {
        return sendError(error);
    }
}

export async function POST(req) {
    try {
        await connectDB();

        let data;
        try {
            data = await req.json();
        } catch (err) {
            return sendError("Invalid JSON body", 400);
        }

        const { name, amount } = data;
        if (!name || amount == null) {
            return sendError("Missing required fields", 400);
        }

        const bill = await Bill.create({ name, amount });
        return NextResponse.json(bill, { status: 201 });

    } catch (error) {
        return sendError(error);
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const data = await req.json();
        if (!data._id) return sendError("Missing bill ID", 400);

        const updated = await Bill.findByIdAndUpdate(data._id, data, {
            new: true,
        });

        if (!updated) return sendError("Bill not found", 404);

        return NextResponse.json(updated);

    } catch (error) {
        return sendError(error);
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data._id) return sendError("Missing bill ID", 400);

        const deleted = await Bill.findByIdAndDelete(data._id);

        if (!deleted) return sendError("Bill not found", 404);

        return NextResponse.json({ success: true });

    } catch (error) {
        return sendError(error);
    }
}