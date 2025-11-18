"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!image) return alert("Select an image first!");

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      setUrl(data.secure_url);
alert(" ok");
    } else {
      alert("Upload failed: " + data.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Image to Cloudinary</h2>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={handleUpload} style={{ marginTop: 10 }}>
        Upload
      </button>

      {url && (
        <div style={{ marginTop: 20 }}>
          <h3>Uploaded Image:</h3>
          <img src={url} width="300" />
        </div>
      )}
    </div>
  );
}