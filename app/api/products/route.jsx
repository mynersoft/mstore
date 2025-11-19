import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";

import cloudinary from "@/lib/cloudinary";

// ================== GET ===================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 🔥 Backend totalAmount calculation
    const totalAmount = products.reduce(
      (sum, p) => sum + (p.stock || 0) * (p.regularPrice || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        products,
        totalAmount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

// ================== POST ===================




export async function POST(req) {
  try {
    // 1️⃣ Connect to DB
    await connectDB();

    // 2️⃣ Get form data
    const formData = await req.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const brand = formData.get("brand");
    const stock = formData.get("stock");
    const regularPrice = formData.get("regularPrice");
    const sellPrice = formData.get("sellPrice");
    const warranty = formData.get("warranty");

    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 3️⃣ Convert image file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4️⃣ Upload image to Cloudinary
    const uploadRes = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (err, result) => {
          if (err) resolve({ error: err.message });
          resolve(result);
        })
        .end(buffer);
    });

    if (uploadRes.error) {
      return NextResponse.json({ error: uploadRes.error }, { status: 500 });
    }

    // 5️⃣ Save product in DB
    const product = await Product.create({
      name,
      category,
      subCategory,
      brand,
      stock,
      regularPrice,
      sellPrice,
      warranty,
      image: uploadRes.secure_url,
    });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}






// ================== PUT ===================
export async function PUT(request) {
  await connectDB();
  const body = await request.json();

  const updated = await Product.findByIdAndUpdate(body._id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

// ================== DELETE ===================
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}