import mongoose, { Schema, models, model } from "mongoose";

const productSchema = new Schema(
	{
		name: String,
		price: Number,
		stock: Number,
		brand: String,
		image: String,
		sold: { type: Number, default: 0 },
		profit: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
