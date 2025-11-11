import { NextResponse } from "next/server";
import cloudinary, { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
	const data = await request.formData();
	const file = data.get("file");

	if (!file) {
		return NextResponse.json(
			{ error: "No file uploaded" },
			{ status: 400 }
		);
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	const upload = await new Promise((resolve, reject) => {
		const stream = uploadToCloudinary.uploader.upload_stream(
			{ folder: "products" },
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			}
		);
		stream.end(buffer);
	});

	return NextResponse.json({ url: upload.secure_url });
}
