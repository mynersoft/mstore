"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux Slice Actions (change according to your slice)
import { setProductsByCategory } from "@/redux/productsSlice";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  // Load category-wise products
  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/products-by-category");
      const data = await res.json();
      dispatch(setProductsByCategory(data.categories || {}));
    }
    loadData();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ------------------ Sidebar ------------------ */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>

        <ul className="space-y-2">
          {Object.keys(categories)?.map((category) => (
            <li
              key={category}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* ------------------ Main Content ------------------ */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Products by Category</h1>

        {Object.keys(categories).map((category) => (
          <div key={category} className="mb-8">
            {/* Category Title */}
            <h2 className="text-xl font-semibold mb-3">
              {category} Category
            </h2>

            {/* Product List */}
            <ul className="list-decimal ml-5 bg-white p-4 rounded shadow">
              {categories[category].map((product, index) => (
                <li key={index} className="py-1">
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}