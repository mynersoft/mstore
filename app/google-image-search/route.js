export async function POST(req) {
  try {
    const { query } = await req.json();

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_CX;

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&searchType=image&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    return Response.json({ images: data.items || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}