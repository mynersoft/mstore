"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "@/redux/productSlice";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProductFormModal({ editingProduct, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(
    editingProduct || {
      name: "",
      category: "",
      subCategory: "",
      brand: "",
      stock: "",
      regularPrice: "",
      sellPrice: "",
      warranty: "",
      dealerName: "",
      image: "",
    }
  );
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;
    if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

    const data = { ...form, image: imageUrl };
    if (editingProduct) {
      dispatch(updateProduct(data));
    } else {
      dispatch(addProduct(data));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-lg">
        <h2 className="text-xl text-gray-200 mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input type="text" placeholder="Product Name" className="p-2 bg-gray-800 rounded"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="text" placeholder="Category" className="p-2 bg-gray-800 rounded"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input type="text" placeholder="Sub Category" className="p-2 bg-gray-800 rounded"
            value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} />
          <input type="text" placeholder="Brand" className="p-2 bg-gray-800 rounded"
            value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input type="number" placeholder="Stock" className="p-2 bg-gray-800 rounded"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input type="number" placeholder="Regular Price" className="p-2 bg-gray-800 rounded"
            value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: e.target.value })} />
          <input type="number" placeholder="Sell Price" className="p-2 bg-gray-800 rounded"
            value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} />
          <input type="text" placeholder="Warranty" className="p-2 bg-gray-800 rounded"
            value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
          <input type="text" placeholder="Dealer Name" className="p-2 bg-gray-800 rounded"
            value={form.dealerName} onChange={(e) => setForm({ ...form, dealerName: e.target.value })} />

          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

          <button type="submit" className="bg-green-600 text-white py-2 rounded">
            {editingProduct ? "Update" : "Add Product"}
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-gray-400 hover:text-white">
          Close
        </button>
      </div>
    </div>
  );
}