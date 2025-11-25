
import connectDB from "@/lib/dbConnect"; // adjust path
import Product from "@/models/Product"; // adjust path
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    await connectDB();
    const body = await request.json();
    // expected: { regularPrice: <number|null> }
    const update = {};
    if (Object.prototype.hasOwnProperty.call(body, "regularPrice")) {
      update.regularPrice =
        body.regularPrice === null ? null : Number(body.regularPrice);
    } else {
      return NextResponse.json(
        { error: "regularPrice is required in body" },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("API update price error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}