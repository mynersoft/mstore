import mongoose, { Schema } from "mongoose";

const DueSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["due", "paid"], default: "due" },
  },
  { timestamps: true }
);

export default mongoose.models.Due || mongoose.model("Due", DueSchema);