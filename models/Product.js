import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    subCategory: String,
    brand: String,
    stock: Number,
    regularPrice: Number,
    sellPrice: Number,
    warranty: String,
    dealerName: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);