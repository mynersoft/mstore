import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true, default: 0 },
	sold: { type: Number, required: true, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product ||
	mongoose.model("Product", ProductSchema);
