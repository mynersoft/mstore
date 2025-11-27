import mongoose from "mongoose";

const InvestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    investType: {
      type: String,
      enum: ["dukaner-malamal", "tools", "cash"],
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Invest || mongoose.model("Invest", InvestSchema);