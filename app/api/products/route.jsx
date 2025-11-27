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

    // 1️⃣ Fetch paginated products
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 2️⃣ Calculate totalAmount from ALL products (no pagination)
    const allProducts = await Product.find({}, { stock: 1, regularPrice: 1 });

    const totalAmount = allProducts.reduce((sum, p) => {
      const stock = Number(p.stock) || 0;
      const price = Number(p.regularPrice) || 0;
      return sum + stock * price;
    }, 0);

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

console.log(finalImage);
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
  try {
    await connectDB();

    const form = await request.formData();
    const id = form.get("_id");   // ← Important!

    if (!id) {
      return NextResponse.json({ error: "Product ID missing" }, { status: 400 });
    }

    const updates = {};

    // Collect all fields
    form.forEach((value, key) => {
      if (key !== "image" && key !== "_id") {
        updates[key] = value;
      }
    });

    // If new image uploaded → upload to Cloudinary
    const file = form.get("image");

    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());

      const upload = await cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) console.error(error);
        }
      );

      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      }).then((result) => {
        updates.image = result.secure_url;
      });
    }

    // Update DB
    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ================== DELETE ===================
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}