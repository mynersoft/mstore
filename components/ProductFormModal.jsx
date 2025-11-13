"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProductFormModal({
  editingProduct,
  onClose,
  currentPage = 1,
}) {
  const dispatch = useDispatch();
  const { list: categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    stock: 0,
    regularPrice: 0,
    sellPrice: 0,
    warranty: "",
    dealerName: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm({
        name: "",
        category: "",
        subCategory: "",
        brand: "",
        stock: "",
        regularPrice: "",
        sellPrice: "",
        warranty: "",
        image: "",
      });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let imageUrl = form.image;
      if (file) imageUrl = await uploadToCloudinary(file);

      const payload = { ...form, image: imageUrl };

      if (editingProduct) {
        await dispatch(updateProduct(payload)).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }

      dispatch(fetchProducts({ page: currentPage }));
      onClose();
    } catch (err) {
      alert("Save failed: " + (err.message || err));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory =
    categories.find((cat) => cat.name === form.category) || {};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto p-5 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Product Name */}
          <input
            required
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 rounded bg-gray-800 w-full"
          />

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              required
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory: "",
                })
              }
              className="p-3 rounded bg-gray-800 w-full"
            >
              <option value="">Select category</option>
              {catLoading ? (
                <option>Loading...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>

            <select
              required
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
              className="p-3 rounded bg-gray-800 w-full"
              disabled={!selectedCategory.subCategories}
            >
              <option value="">Select subcategory</option>
              {selectedCategory.subCategories?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Brand & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="p-3 rounded bg-gray-800 w-full"
            />
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              className="p-3 rounded bg-gray-800 w-full"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Regular Price"
              value={form.regularPrice}
              onChange={(e) =>
                setForm({ ...form, regularPrice: Number(e.target.value) })
              }
              className="p-3 rounded bg-gray-800 w-full"
            />
            <input
              type="number"
              placeholder="Sell Price"
              value={form.sellPrice}
              onChange={(e) =>
                setForm({ ...form, sellPrice: Number(e.target.value) })
              }
              className="p-3 rounded bg-gray-800 w-full"
            />
          </div>

          {/* Warranty */}
          <input
            placeholder="Warranty (e.g., 6 months)"
            value={form.warranty}
            onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            className="p-3 rounded bg-gray-800 w-full"
          />

          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              id="img"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
            <div className="flex gap-2">
              {form.image && !file && (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded w-full sm:w-auto"
            >
              {saving ? "Saving..." : editingProduct ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}