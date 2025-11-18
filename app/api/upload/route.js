import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) return NextResponse.json({ error: "Image not found" });

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary upload via upload_stream
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "next_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(NextResponse.json(result));
        }
      );

      upload.end(buffer);
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}