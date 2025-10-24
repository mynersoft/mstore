// models/ServiceRecord.js
import mongoose from "mongoose";

const ServiceRecordSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    deviceName: { type: String, required: true, trim: true },
    billAmount: { type: Number, default: 0 },
    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyMonths: { type: Number, default: 0 }, // if warranty given, months length
    },
    notes: { type: String, default: "" },
    receivedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["received", "in_progress", "done", "delivered"], default: "received" },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceRecord || mongoose.model("ServiceRecord", ServiceRecordSchema);