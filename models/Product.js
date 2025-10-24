<<<<<<< HEAD
import mongoose, { Schema } from "mongoose";
=======
import mongoose, { Schema, models, model } from "mongoose";
>>>>>>> bda3c51b90d3304c042f7b7fc54cb640cf6a6715

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
