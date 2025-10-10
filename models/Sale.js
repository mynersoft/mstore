const SaleSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	qty: { type: Number, required: true },
	price: { type: Number, required: true }, // unit price at time of sale
	total: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
