"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// === Redux Slice Example (inside same file) ===
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: {}, // category: [products]
    loading: false,
  },
  reducers: {
    setProductsByCategory(state, action) {
      state.categories = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

const { setProductsByCategory, setLoading } = productSlice.actions;

// Store
const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

// === Component ===
function ProductListPage() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.products);

  // Fetch API
  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetch("/api/products/getbycat");
      const data = await res.json();

      dispatch(setProductsByCategory(data.categories || {}));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex">
      {/* === Sidebar === */}
      <aside className="w-64 bg-gray-200 p-4 h-screen">
        <h2 className="font-bold text-lg mb-3">Categories</h2>

        <ul className="space-y-1">
          {Object.keys(categories || {}).map((cat) => (
            <li key={cat} className="p-2 bg-white rounded shadow">
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* === Product List === */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Products by Category</h1>

        {loading && <p>Loading...</p>}

        {!loading &&
          Object.keys(categories || {}).map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {category} Category
              </h2>

              <ul className="list-decimal ml-6">
                {(categories[category] || []).map((product, idx) => (
                  <li key={idx}>{product.name}</li>
                ))}
              </ul>
            </div>
          ))}
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