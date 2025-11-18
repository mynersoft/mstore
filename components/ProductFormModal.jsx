"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "@/redux/productSlice";

export default function ProductFormModal({
  open,
  onClose,
  editingProduct,
  currentPage,
}) {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null); // new image file
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    image: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
      setFile(null);
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
        subCategory: "",
        image: "",
      });
      setFile(null);
    }
  }, [editingProduct]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler (upload + save)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = form.image;

      // If new image selected → upload first
      if (file) {
        const fd = new FormData();
        fd.append("image", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.secure_url) {
          alert("Image upload failed");
          setSaving(false);
          return;
        }

        imageUrl = uploadData.secure_url;
      }

      // Build final payload
      const payload = {
        ...form,
        image: imageUrl,
      };

      if (editingProduct) {
        await dispatch(updateProduct(payload)).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }

      dispatch(fetchProducts({ page: currentPage }));
      onClose();
    } catch (error) {
      alert("Save failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "Update Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Product Name */}
          <div>
            <label className="font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-medium">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Sub Category */}
          <div>
            <label className="font-medium">Sub Category</label>
            <input
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          {/* Image Select */}
          <div>
            <label className="font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          {/* Existing image preview */}
          {form.image && !file && (
            <img
              src={form.image}
              alt="Old"
              className="w-24 h-24 object-cover rounded mt-2"
            />
          )}

          {/* Submit buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {saving
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}