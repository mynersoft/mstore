// components/ProductFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "@/redux/productSlice";

export default function ProductFormModal({ editingProduct, onClose, currentPage = 1 }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
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

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      // ensure fields exist
      setForm({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        subCategory: editingProduct.subCategory || "",
        brand: editingProduct.brand || "",
        stock: editingProduct.stock ?? "",
        regularPrice: editingProduct.regularPrice ?? "",
        sellPrice: editingProduct.sellPrice ?? "",
        warranty: editingProduct.warranty || "",
        image: editingProduct.image || "",
        _id: editingProduct._id || undefined,
      });
      setFile(null);
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
      setFile(null);
    }
  }, [editingProduct]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // single button submit: upload image (if selected) then create/update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("subCategory", form.subCategory);
      fd.append("brand", form.brand);
      fd.append("stock", form.stock);
      fd.append("regularPrice", form.regularPrice);
      fd.append("sellPrice", form.sellPrice);
      fd.append("warranty", form.warranty);

      // include existing image so server keeps it if no new file
      if (form.image) fd.append("existingImage", form.image);
      if (file) fd.append("image", file);

      if (form._id) {
        // update
        await dispatch(updateProduct({ id: form._id, formData: fd })).unwrap();
      } else {
        // add
        await dispatch(addProduct(fd)).unwrap();
      }

      await dispatch(fetchProducts({ page: currentPage, limit: 20 })); // refresh
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-2xl p-5 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{form._id ? "Edit Product" : "Add Product"}</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="block text-sm">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="p-3 rounded bg-gray-800 w-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Category</label>
              <input name="category" value={form.category} onChange={handleChange} required className="p-3 rounded bg-gray-800 w-full" />
            </div>
            <div>
              <label className="block text-sm">Sub Category</label>
              <input name="subCategory" value={form.subCategory} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
            </div>
            <div>
              <label className="block text-sm">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Regular Price</label>
              <input name="regularPrice" type="number" value={form.regularPrice} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
            </div>
            <div>
              <label className="block text-sm">Sell Price</label>
              <input name="sellPrice" type="number" value={form.sellPrice} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm">Warranty</label>
            <input name="warranty" value={form.warranty} onChange={handleChange} className="p-3 rounded bg-gray-800 w-full" />
          </div>

          <div>
            <label className="block text-sm">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mt-2" />
            <div className="mt-2">
              {form.image && !file && <img src={form.image} alt="preview" className="w-24 h-24 object-cover rounded" />}
              {file && <img src={URL.createObjectURL(file)} alt="preview" className="w-24 h-24 object-cover rounded" />}
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 rounded">
              {saving ? "Saving..." : form._id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}