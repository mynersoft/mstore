"use client";

import { useState } from "react";
import GoogleImagePicker from "@/components/GoogleImagePicker";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImageSelect = async (googleImageUrl) => {
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl: googleImageUrl }),
    });

    const data = await res.json();
    setImageUrl(data.url);
  };

  const saveProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        price,
        image: imageUrl,
      }),
    });

    const data = await res.json();
    alert("Product saved!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Add Product</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <GoogleImagePicker onSelect={handleImageSelect} />

      {imageUrl && (
        <img src={imageUrl} className="mt-4 w-40 border rounded" />
      )}

      <button
        className="mt-4 bg-green-600 text-white px-4 py-2"
        onClick={saveProduct}
      >
        Save Product
      </button>
    </div>
  );
}