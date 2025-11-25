"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProductsByCategory } from "@/redux/productsSlice";

export default function ProductsByCategoryPage() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByCategory());
  }, [dispatch]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-4">
      {Object.keys(categories).map((category) => (
        <div key={category} className="mb-6 bg-gray-100 p-4 rounded">
          {/* Category Title */}
          <h2 className="text-2xl font-bold mb-2 text-blue-600">
            {category} Category
          </h2>

          {/* Product List */}
          <ul className="list-decimal ml-6">
            {categories[category].map((product, index) => (
              <li key={index} className="py-1 text-lg">
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}