let dues = []; // in-memory storage (replace with MongoDB in real app)

export default function handler(req, res) {
  if (req.method === "GET") return res.status(200).json(dues);

  if (req.method === "POST") {
    const { customerName, phone, dueAmount } = req.body;
    const newDue = {
      _id: Date.now().toString(),
      customerName,
      phone,
      dueAmount,
      paid: 0,
      lastPaymentDate: null
    };
    dues.push(newDue);
    return res.status(201).json(newDue);
  }

  res.status(405).end();
}