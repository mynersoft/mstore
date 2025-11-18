"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Image Preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Upload to Cloudinary API
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      alert("Upload failed: " + data?.error);
      return;
    }

    setUploadedUrl(data.url);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload Image</h1>

      {/* Select File */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Preview Image */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded mb-4"
        />
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 px-4 py-2 rounded text-white"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Show Uploaded URL */}
      {uploadedUrl && (
        <div className="mt-4 p-3 bg-gray-900 rounded">
          <p className="text-sm text-gray-300">Uploaded Image URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            className="text-blue-400 break-all"
          >
            {uploadedUrl}
          </a>

          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="mt-3 w-40 h-40 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
}