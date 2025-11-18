import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

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