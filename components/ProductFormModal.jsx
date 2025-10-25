// components/ProductFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "@/redux/productSlice";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProductFormModal({ editingProduct, onClose, currentPage = 1 }) {
  const dispatch = useDispatch();
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
    if (editingProduct) setForm(editingProduct);
    else
      setForm({
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
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let imageUrl = form.image;

      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const payload = { ...form, image: imageUrl };

      if (editingProduct) {
        await dispatch(updateProduct(payload)).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }

      // refresh current page
      dispatch(fetchProducts({ page: currentPage }));
      onClose();
    } catch (err) {
      alert("Save failed: " + (err.message || err));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-2xl p-6">
        <h3 className="text-lg mb-3">{editingProduct ? "Edit Product" : "Add Product"}</h3>

        <form onSubmit={handleSubmit} className="grid gap-2">
          <input required placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 rounded bg-gray-800" />

          <div className="flex gap-2">
            <select required value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="p-2 rounded bg-gray-800 flex-1">
              <option value="">Select category</option>
              <option value="Mobile">Mobile</option>
              <option value="Accessory">Accessory</option>
              <option value="Tablet">Tablet</option>
            </select>
            <input placeholder="Sub category" value={form.subCategory} onChange={(e)=>setForm({...form, subCategory:e.target.value})} className="p-2 rounded bg-gray-800 flex-1" />
          </div>

          <div className="flex gap-2">
            <input placeholder="Brand" value={form.brand} onChange={(e)=>setForm({...form, brand:e.target.value})} className="p-2 rounded bg-gray-800 flex-1" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form, stock: Number(e.target.value)})} className="p-2 rounded bg-gray-800 w-32" />
          </div>

          <div className="flex gap-2">
            <input type="number" placeholder="Regular Price" value={form.regularPrice} onChange={(e)=>setForm({...form, regularPrice: Number(e.target.value)})} className="p-2 rounded bg-gray-800 flex-1" />
            <input type="number" placeholder="Sell Price" value={form.sellPrice} onChange={(e)=>setForm({...form, sellPrice: Number(e.target.value)})} className="p-2 rounded bg-gray-800 flex-1" />
          </div>

          <input placeholder="Warranty (e.g., 6 months)" value={form.warranty} onChange={(e)=>setForm({...form, warranty: e.target.value})} className="p-2 rounded bg-gray-800" />
          <input placeholder="Dealer Name" value={form.dealerName} onChange={(e)=>setForm({...form, dealerName: e.target.value})} className="p-2 rounded bg-gray-800" />

          <div className="flex items-center gap-3">
            <input id="img" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])} />
            {form.image && !file && <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded" />}
            {file && <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />}
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-1 bg-green-600 rounded">
              {saving ? "Saving..." : editingProduct ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}