// app/api/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "next_uploads" },
        (err, result) => {
          if (err) {
            // JSON response even on error
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json(result));
          }
        }
      );
      upload.end(buffer);
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}