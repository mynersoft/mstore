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






// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================================
// ⭐ POST → Add new product
// ======================================================
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const brand = formData.get("brand");
    const stock = Number(formData.get("stock") || 0);
    const regularPrice = Number(formData.get("regularPrice") || 0);
    const sellPrice = Number(formData.get("sellPrice") || 0);
    const warranty = formData.get("warranty");

    let finalImage = "";

    // 🔹 Case 1 → User selected Google Image (URL → Cloudinary)
    const googleImageUrl = formData.get("imageUrl");

    if (googleImageUrl) {
      const uploadResponse = await cloudinary.uploader.upload(googleImageUrl, {
        folder: "products",
      });
      finalImage = uploadResponse.secure_url;
    }

    // 🔹 Case 2 → User uploaded local image file
    const file = formData.get("image");
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "products" },
            (err, result) => (err ? reject(err) : resolve(result))
          )
          .end(buffer);
      });

      finalImage = uploadResponse.secure_url;
    }

    // 🔹 Case 3 → Editing product with old image
    if (!finalImage) {
      finalImage = formData.get("image") || "";
    }

    // ======================================================
    // ⭐ Save Product
    // ======================================================
    const newProduct = await Product.create({
      name,
      category,
      subCategory,
      brand,
      stock,
      regularPrice,
      sellPrice,
      warranty,
      image: finalImage,
    });

    return NextResponse.json({
      product: JSON.parse(JSON.stringify(newProduct)),
    });
  } catch (error) {
    console.error("PRODUCT ADD ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
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