import mongoose, { Schema } from "mongoose";

const BillSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Bill || mongoose.model("Bill", BillSchema);