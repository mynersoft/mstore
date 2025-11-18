import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";

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
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const product = await Product.create(body);
  return NextResponse.json(product);
}

// ================== PUT ===================
export const POST = async (req) => {
  await connectDB();

  try {
    const formData = await req.formData();

    // get all fields
    const name = formData.get("name");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const brand = formData.get("brand");
    const stock = Number(formData.get("stock") || 0);
    const regularPrice = Number(formData.get("regularPrice") || 0);
    const sellPrice = Number(formData.get("sellPrice") || 0);
    const warranty = formData.get("warranty");

    // get file
    const file = formData.get("image");
    let imageUrl = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      imageUrl = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "next_uploads" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        upload.end(buffer);
      });
    }

    const product = await Product.create({
      name,
      category,
      subCategory,
      brand,
      stock,
      regularPrice,
      sellPrice,
      warranty,
      image: imageUrl,
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
};
// ================== DELETE ===================
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}