import { connectDB } from "../../../lib/mongodb";
import Transaction from "../../../models/Transaction";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const data = await Transaction.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, amount, type } = req.body;

    if (!name || !amount || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newItem = await Transaction.create({
      name,
      amount: Number(amount),
      type
    });

    return res.status(201).json(newItem);
  }

  res.status(405).json({ message: "Method not allowed" });
}