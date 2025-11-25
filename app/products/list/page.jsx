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
    categories: {}, // grouped products
    allProducts: [], // ALL products
    activeCategory: "All", // default show all products
    loading: false,
  },
  reducers: {
    setProductsByCategory(state, action) {
      state.categories = action.payload.categories;
      state.allProducts = action.payload.allProducts;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

const { setProductsByCategory, setActiveCategory, setLoading } =
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

      dispatch(
        setProductsByCategory({
          categories: data.categories || {},
          allProducts: data.allProducts || [],
        })
      );

      dispatch(setLoading(false));
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Determine which products to show
  let productsToShow = [];

  if (activeCategory === "All") {
    productsToShow = allProducts; // all products initially
  } else {
    productsToShow = categories[activeCategory] || [];
  }

  return (
    <div className="flex">
      {/* === Sidebar === */}
      <aside className="w-64 bg-gray-200 p-4 h-screen">
        <h2 className="font-bold text-lg mb-3">Categories</h2>

        <ul className="space-y-1">
          {/* Show ALL button */}
          <li
            onClick={() => dispatch(setActiveCategory("All"))}
            className={`p-2 rounded cursor-pointer shadow ${
              activeCategory === "All" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            All Products
          </li>

          {Object.keys(categories || {}).map((cat) => (
            <li
              key={cat}
              onClick={() => dispatch(setActiveCategory(cat))}
              className={`p-2 rounded cursor-pointer shadow ${
                activeCategory === cat ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* === Product List === */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === "All"
            ? "All Products"
            : `${activeCategory} Category`}
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <ul className="list-decimal ml-6">
            {productsToShow.map((product, idx) => (
              <li key={idx} className="mb-1">
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