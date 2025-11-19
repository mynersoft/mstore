"use client";

import { useState } from "react";

export default function GoogleImagePicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    setLoading(true);
    const res = await fetch("/api/google-image-search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setImages(data.images);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded">
      <h3>Google Image Search</h3>

      <div className="flex gap-2 mt-2">
        <input
          className="border p-2 flex-1"
          placeholder="Search product image..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4" onClick={searchImages}>
          Search
        </button>
      </div>

      {loading && <p className="mt-4">Searching...</p>}

      <div className="grid grid-cols-3 gap-3 mt-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.link}
            onClick={() => onSelect(img.link)}
            className="cursor-pointer rounded border hover:scale-105 transition"
          />
        ))}
      </div>
    </div>
  );
}