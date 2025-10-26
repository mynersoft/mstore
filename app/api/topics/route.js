import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Topic from "@/models/Topic";

export async function GET() {
  await connectDB();
  const topics = await Topic.find();
  return NextResponse.json(topics);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const topic = await Topic.create(body);
  return NextResponse.json(topic);
}