import connectDB from "@/lib/connectDB";
import AyBay from "@/models/AyBay";

// UPDATE ay-bay by ID
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!id)
    return Response.json({ success: false, message: "ID প্রয়োজন" }, { status: 400 });

  const body = await req.json();

  const updated = await AyBay.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated)
    return Response.json({ success: false, message: "ডাটা পাওয়া যায়নি" }, { status: 404 });

  return Response.json({ success: true, data: updated });
}

// DELETE by ID
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!id)
    return Response.json({ success: false, message: "ID প্রয়োজন" }, { status: 400 });

  const deleted = await AyBay.findByIdAndDelete(id);

  if (!deleted)
    return Response.json({ success: false, message: "ডাটা পাওয়া যায়নি" }, { status: 404 });

  return Response.json({ success: true, id: deleted._id, message: "ডিলিট সম্পন্ন হয়েছে" });
}