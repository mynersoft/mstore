"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTopic } from "@/redux/topicSlice";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AddTopicForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    const pdfUrl = await uploadToCloudinary(file);
    await dispatch(addTopic({ title, pdfUrl }));
    setTitle("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 text-white">
      <input
        type="text"
        placeholder="Topic title"
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" className="mt-2 bg-green-600 px-3 py-1 rounded">
        Upload PDF
      </button>
    </form>
  );
}