// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
// 	throw new Error("Please add MONGODB_URI to your environment variables");
// }

// let cached = global.mongoose;
// if (!cached) cached = global.mongoose = { conn: null, promise: null };

// export async function connectDB() {
// 	if (cached.conn) return cached.conn;
// 	if (!cached.promise) {
// 		cached.promise = mongoose
// 			.connect(MONGODB_URI)
// 			.then((mongoose) => mongoose);
// 	}
// 	cached.conn = await cached.promise;
// 	return cached.conn;
// }



// lib/dbConnect.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
	if (isConnected) return;

	try {
		if (!process.env.MONGODB_URI) {
			throw new Error("MONGODB_URI is missing");
		}

		await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		});

		isConnected = true;
		console.log("MongoDB Connected");
	} catch (err) {
		console.error("MongoDB Connection Error:", err);
		throw err;
	}
}
