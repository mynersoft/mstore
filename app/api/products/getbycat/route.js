export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    // 🔥 Group by category
    const grouped = products.reduce((acc, item) => {
      const category = item.category || "Uncategorized";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(item);

      return acc;
    }, {});

    return NextResponse.json(
      {
        success: true,
        categories: grouped,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server Error" });
  }
}