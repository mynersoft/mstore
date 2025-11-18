"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!image) return alert("Image required");
    if (!name || !price) return alert("Input fields missing");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product saved!");
        console.log(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Product</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}