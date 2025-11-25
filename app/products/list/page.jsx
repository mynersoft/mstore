"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import * as XLSX from "xlsx"; // npm i xlsx

// ---------------- Redux slice (same-file) ----------------
const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: {},
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

const store = configureStore({
  reducer: { products: productSlice.reducer },
});

// ---------------- Page Component ----------------
function ProductListPage() {
  const dispatch = useDispatch();
  const { categories, allProducts, activeCategory, loading, sidebarOpen } =
    useSelector((s) => s.products);

  // local UI state
  const [search, setSearch] = useState("");
  const [priceEdits, setPriceEdits] = useState({}); // { [id]: "123" }
  const [savingIds, setSavingIds] = useState({}); // loading per-row

  // Fetch API (same endpoint you used)
  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetch("/api/products/getbycat");
      const data = await res.json();

      const cats = data.categories || {};
      const sortedCats = {};
      Object.keys(cats)
        .sort((a, b) => a.localeCompare(b))
        .forEach((k) => (sortedCats[k] = cats[k]));

      dispatch(setProductsByCategory(sortedCats));
      dispatch(setAllProducts(Object.values(sortedCats).flat()));
      dispatch(setLoading(false));
    } catch (err) {
      console.error("loadData error:", err);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Which products to show (category filter) then search filter
  const shownByCategory =
    activeCategory === null ? allProducts : categories[activeCategory] || [];

  const shownProducts = shownByCategory.filter((p) =>
    (p.name || "")
      .toString()
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  // Initialize priceEdits when products load / change
  useEffect(() => {
    const map = {};
    (shownProducts || []).forEach((p) => {
      if (p && p._id) map[p._id] =
        typeof p.regularPrice !== "undefined" && p.regularPrice !== null
          ? p.regularPrice
          : "";
    });
    setPriceEdits((prev) => ({ ...map, ...prev })); // preserve edits for other lists if any
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, activeCategory, search]);

  // ---------------- Update price API (Option B)
  // PUT /api/products/[id]  body: { regularPrice }
  const updatePrice = async (id, newPrice) => {
    if (!id) return;
    setSavingIds((s) => ({ ...s, [id]: true }));
    try {
      const body = { regularPrice: Number(newPrice === "" ? null : newPrice) };
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Update failed");
      }

      // Optional: refresh list after update
      await loadData();
    } catch (err) {
      console.error("updatePrice error:", err);
      alert("Price update failed: " + (err.message || ""));
    } finally {
      setSavingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  // Per-row onChange for input
  const handlePriceChange = (id, value) => {
    setPriceEdits((p) => ({ ...p, [id]: value }));
  };

  // Save single row (called from Save button or onBlur)
  const handleSave = (id) => {
    const val = priceEdits[id];
    updatePrice(id, val);
  };

  // Save all visible rows (bulk)
  const saveAllVisible = async () => {
    // iterate visible products and call updatePrice for those changed
    for (const prod of shownProducts) {
      const id = prod._id;
      const newVal = priceEdits[id];
      const oldVal = prod.regularPrice;
      // Only call update if actually different (use loose compare)
      if (String(newVal) !== String(oldVal)) {
        // eslint-disable-next-line no-await-in-loop
        await updatePrice(id, newVal);
      }
    }
    alert("Save completed.");
  };

  // ===========================
  //    EXPORT EXCEL FUNCTION
  // ===========================
  const exportToExcel = () => {
    const excelData = shownProducts.map((p, i) => ({
      SL: i + 1,
      Name: p.name,
      Price: priceEdits[p._id] ?? p.regularPrice ?? "",
      Remarks: p.remarks ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  // ===========================
  //         PRINT TABLE
  // ===========================
  const printTable = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const win = window.open("", "", "width=1000,height=800");
    win.document.write(`
      <html>
        <head>
          <title>Print Products</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="flex">
      {/* Sidebar Toggle */}
      <button
        className="absolute top-[60px] left-4 p-2 bg-black text-white rounded-md z-50"
        onClick={() => dispatch(toggleSidebar())}
      >
        {sidebarOpen ? "Hide Menu" : "Show Menu"}
      </button>

      {/* Sidebar */}
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

      {/* Main */}
      <main className="flex-1 p-6 ml-10">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === null
            ? "All Products"
            : `${activeCategory} Products`}
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search all products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-64"
            />
            <button
              onClick={() => {
                setSearch("");
              }}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Excel
            </button>

            <button
              onClick={printTable}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Print
            </button>

            <button
              onClick={saveAllVisible}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save All Visible
            </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && shownProducts.length === 0 && <p>No products found.</p>}

        {/* PRINT AREA */}
        <div id="print-area">
          {!loading && shownProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">SL</th>
                    <th className="border p-2 text-left">Product Name</th>
                    <th className="border p-2 text-left">Regular Price</th>
                    <th className="border p-2 text-left">Remarks</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {shownProducts.map((product, idx) => {
                    const id = product._id ?? idx;
                    const currentVal =
                      typeof priceEdits[id] !== "undefined"
                        ? priceEdits[id]
                        : product.regularPrice ?? "";
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="border p-2">{idx + 1}</td>
                        <td className="border p-2">{product.name}</td>

                        <td className="border p-2">
                          <input
                            type="number"
                            value={currentVal}
                            onChange={(e) =>
                              handlePriceChange(id, e.target.value)
                            }
                            onBlur={() => handleSave(id)}
                            className="border px-2 py-1 w-28"
                          />
                        </td>

                        <td className="border p-2">{product.remarks ?? ""}</td>

                        <td className="border p-2">
                          <button
                            onClick={() => handleSave(id)}
                            disabled={!!savingIds[id]}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                          >
                            {savingIds[id] ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={() => {
                              // reset to original
                              setPriceEdits((p) => ({
                                ...p,
                                [id]: product.regularPrice ?? "",
                              }));
                            }}
                            className="bg-gray-300 text-black px-3 py-1 rounded"
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Final export wrapped with Provider
export default function Page() {
  return (
    <Provider store={store}>
      <ProductListPage />
    </Provider>
  );
}