import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Product from "@/models/Product";
import { connectDB } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    // 📌 Get fields from formData
    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");

    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 📌 Convert image file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 📌 Upload to Cloudinary
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

    // 📌 Save product in DB
    const product = await Product.create({
      name,
      price,
      description,
      image: uploadRes.secure_url,
    });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}