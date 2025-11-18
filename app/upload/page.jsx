"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // 🔹 Upload image to Cloudinary
  async function uploadToCloudinary() {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok && data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error || "Upload failed");
    }
  }

  // 🔹 Submit all data
  async function handleSubmit() {
    if (!image) return alert("Please select an image");
    if (!name || !price) return alert("Input fields required");

    setLoading(true);

    try {
      // upload image
      const uploadedUrl = await uploadToCloudinary();
      setUrl(uploadedUrl);

      // post to backend
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          price,
          description,
          image: uploadedUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product saved successfully!");
        console.log("Saved:", data);
      } else {
        alert("Save error: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Product</h2>

      <br />

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <input
        type="number"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Saving..." : "Save Product"}
      </button>

      {url && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={url} width="200" />
        </div>
      )}
    </div>
  );
}