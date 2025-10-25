import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return Response.json(categories);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newCategory = await Category.create({ name: body.name });
  return Response.json(newCategory);
}