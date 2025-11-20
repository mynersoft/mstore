"use client";

import { useState } from "react";

export default function TestPage() {
  const [query, setQuery] = useState("shoes");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const search = async () => {
    setLoading(true);
    setSelected(null);
    setResult(null);

    const res = await fetch(`/api/test/search?query=${query}`);
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  };

  const saveSelected = async () => {
    if (!selected) return alert("Please select an image first");
    setSaving(true);

    const res = await fetch(`/api/test/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: selected.src, title: query }),
    });

    const data = await res.json();
    setSaving(false);
    setResult(data);
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Google Image Search Test</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Search term"
        />
        <button
          onClick={search}
          className="border px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelected(img)}
            className={`cursor-pointer border rounded p-1 ${
              selected?.src === img.src ? "ring-2 ring-blue-400" : ""
            }`}
          >
            <img
              src={img.src}
              className="w-full h-40 object-cover rounded"
            />
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4">
          <button
            onClick={saveSelected}
            className="border px-4 py-2 rounded"
          >
            {saving
              ? "Saving..."
              : "Save selected image to Cloudinary & DB"}
          </button>
        </div>
      )}

      {result && (
        <pre className="mt-4 p-3 border rounded bg-gray-50 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}