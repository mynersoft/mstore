import {connectDB} from "@/lib/dbConnect";
import AyBay from "@/models/Aybay";

// UPDATE ay-bay by ID
export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();

  const updatedAyBay = await AyBay.findByIdAndUpdate(
    id,
    {
      title: body.title,
      amount: body.amount,
      type: body.type,
      category: body.category,
      date: body.date,
    },
    { new: true, runValidators: true }
  );

  if (!updatedAyBay) {
    return Response.json(
      { success: false, message: "Data not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    data: updatedAyBay,
  });
}