import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	await connectDB();
	const p = await Product.findById(params.id);
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(p);
}

// export async function PUT(request, { params }) {
	const body = await request.json();
	await connectDB();

	const updated = await Product.findByIdAndUpdate(params.id, body, {
		new: true,
	});

	return NextResponse.json(updated);
}





export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory") || "";
    const brand = formData.get("brand") || "";
    const stock = Number(formData.get("stock") || 0);
    const regularPrice = Number(formData.get("regularPrice") || 0);
    const sellPrice = Number(formData.get("sellPrice") || 0);
    const warranty = formData.get("warranty") || "";

    // existingImage can be sent from client to keep old image if no new file
    let imageUrl = formData.get("existingImage") || "";

    const file = formData.get("image");
    if (file && file.size) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = uploaded.secure_url || uploaded.url || imageUrl;
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        subCategory,
        brand,
        stock,
        regularPrice,
        sellPrice,
        warranty,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("PUT /api/product/[id] error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



// Add GET and DELETE if you need; example GET below (optional)
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



export async function DELETE(request, { params }) {
	await connectDB();
	await Product.findByIdAndDelete(params.id);
	return NextResponse.json({ message: "Product deleted" });
}
