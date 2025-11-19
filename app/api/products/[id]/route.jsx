import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	await connectDB();
	const p = await Product.findById(params.id);
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(p);
}

export async function DELETE(request, { params }) {
	await connectDB();
	await Product.findByIdAndDelete(params.id);
	return NextResponse.json({ message: "Product deleted" });
}





export async function PUT(req) {
  try {
    // 1️⃣ Connect to DB
    await connectDB();

    // 2️⃣ Get form data
    const formData = await req.formData();

    const id = formData.get("id"); // product id to update
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const name = formData.get("name");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const brand = formData.get("brand");
    const stock = formData.get("stock");
    const regularPrice = formData.get("regularPrice");
    const sellPrice = formData.get("sellPrice");
    const warranty = formData.get("warranty");

    const file = formData.get("image");

    let imageUrl;

    if (file) {
      // 3️⃣ Convert image file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // 4️⃣ Upload new image to Cloudinary
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

      imageUrl = uploadRes.secure_url;
    }

    // 5️⃣ Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(category && { category }),
        ...(subCategory && { subCategory }),
        ...(brand && { brand }),
        ...(stock && { stock }),
        ...(regularPrice && { regularPrice }),
        ...(sellPrice && { sellPrice }),
        ...(warranty && { warranty }),
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true } // return updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}