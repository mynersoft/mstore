import mongoose, { Schema, models, model } from "mongoose";

const saleSchema = new Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId, // ✅ correct way
		ref: "Product",
	},
	qty: Number,
	price: Number,
	total: Number,
	date: { type: Date, default: Date.now },
});

const Sale = models.Sale || model("Sale", saleSchema);
export default Sale;