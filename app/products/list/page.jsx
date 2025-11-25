"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// === Redux Slice (same file) ===
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: {}, // { categoryName: [products] }
    allProducts: [],
    activeCategory: null,
    loading: false,
    sidebarOpen: true,
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
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

const {
  setProductsByCategory,
  setAllProducts,
  setActiveCategory,
  setLoading,
  toggleSidebar,
} = productSlice.actions;

// Store
const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

// === MAIN COMPONENT ===
function ProductListPage() {
  const dispatch = useDispatch();
  const { categories, allProducts, activeCategory, loading, sidebarOpen } =
    useSelector((state) => state.products);

  // Fetch API
  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetch("/api/products/getbycat");
      const data = await res.json();

      let cats = data.categories || {};

      // Sort category keys alphabetically
      const sortedCats = {};
      Object.keys(cats)
        .sort((a, b) => a.localeCompare(b))
        .forEach((key) => {
          sortedCats[key] = cats[key];
        });

      dispatch(setProductsByCategory(sortedCats));

      // Flatten products in alphabetical category order
      const all = Object.values(sortedCats).flat();
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

  // Which products to show?
  const shownProducts =
    activeCategory === null ? allProducts : categories[activeCategory] || [];

  return (
    <div className="flex">
      {/* === Sidebar Toggle Button === */}
      <button
        className="absolute top-[60px] left-4 p-2 bg-black text-white rounded-md z-50"
        onClick={() => dispatch(toggleSidebar())}
      >
        {sidebarOpen ? "Hide Menu" : "Show Menu"}
      </button>

      {/* === Sidebar === */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-200 p-4 min-h-screen">
          <h2 className="font-bold text-lg mb-3">Categories</h2>

          <ul className="space-y-1">
            <li
              className={`p-2 bg-white rounded shadow cursor-pointer ${
                activeCategory === null ? "bg-blue-300" : ""
              }`}
              onClick={() => dispatch(setActiveCategory(null))}
            >
              All Products ({allProducts.length})
            </li>

            {Object.keys(categories || {}).map((cat) => (
              <li
                key={cat}
                className={`p-2 bg-white rounded shadow cursor-pointer ${
                  activeCategory === cat ? "bg-blue-300" : ""
                }`}
                onClick={() => dispatch(setActiveCategory(cat))}
              >
                {cat} ({categories[cat]?.length || 0})
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* === Product List === */}
      <main className="flex-1 p-6 ml-10">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === null
            ? "All Products"
            : `${activeCategory} Products`}
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && shownProducts.length === 0 && <p>No products found.</p>}

        {!loading && shownProducts.length > 0 && (
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

// === Final Export ===
export default function Page() {
  return (
    <Provider store={store}>
      <ProductListPage />
    </Provider>
  );
}