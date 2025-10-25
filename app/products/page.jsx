"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "@/redux/productSlice";
import ProductFormModal from "@/components/ProductFormModal";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [dispatch, page]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-200">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Sell Price</th>
              <th className="p-3 text-left">Dealer</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">${p.sellPrice}</td>
                  <td className="p-3">{p.dealerName}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={8}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded ${
                page === num
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          editingProduct={editingProduct}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}