"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// === Redux Slice Example (inside same file) ===
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: {},   // category: [products]
    allProducts: [],  // all products
    activeCategory: null,
    loading: false,
  },
  reducers: {
    setProductsByCategory(state, action) {
      state.categories = action.payload;
    },
    setAllProducts(state, action) {
      state.allProducts = action.payload;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

const { setProductsByCategory, setAllProducts, setActiveCategory, setLoading } =
  productSlice.actions;

// Store
const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

// === Component ===
function ProductListPage() {
  const dispatch = useDispatch();
  const { categories, allProducts, activeCategory, loading } = useSelector(
    (state) => state.products
  );

  // Fetch API
  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetch("/api/products/getbycat");
      const data = await res.json();

      dispatch(setProductsByCategory(data.categories || {}));

      // collect all products from categories
      const all = Object.values(data.categories || {}).flat();
      dispatch(setAllProducts(all));

      dispatch(setLoading(false));
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Determine which product list to show
  const shownProducts =
    activeCategory === null
      ? allProducts
      : categories[activeCategory] || [];

  return (
    <div className="flex">
      {/* === Sidebar === */}
      <aside className="w-64 bg-gray-200 p-4 h-screen">
        <h2 className="font-bold text-lg mb-3">Categories</h2>

        <ul className="space-y-1">
          <li
            className={`p-2 bg-white rounded shadow cursor-pointer ${
              activeCategory === null ? "bg-blue-300" : ""
            }`}
            onClick={() => dispatch(setActiveCategory(null))}
          >
            All Products
          </li>

          {Object.keys(categories || {}).map((cat) => (
            <li
              key={cat}
              className={`p-2 bg-white rounded shadow cursor-pointer ${
                activeCategory === cat ? "bg-blue-300" : ""
              }`}
              onClick={() => dispatch(setActiveCategory(cat))}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* === Product List === */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === null
            ? "All Products"
            : `${activeCategory} Category`}
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <ul className="list-decimal ml-6">
            {shownProducts.map((product, idx) => (
              <li key={idx} className="py-1">
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

// === Final Export with Redux Provider ===
export default function Page() {
  return (
    <Provider store={store}>
      <ProductListPage />
    </Provider>
  );
}