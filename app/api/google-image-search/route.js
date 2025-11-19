export async function POST(req) {
  try {
    const { query } = await req.json();

    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CX}&searchType=image&q=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    return Response.json({ images: data.items });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}