"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import * as XLSX from "xlsx"; // <-- Excel export

// Redux Slice
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

// Store
const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

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

      const sortedCats = {};
      Object.keys(cats)
        .sort((a, b) => a.localeCompare(b))
        .forEach((key) => {
          sortedCats[key] = cats[key];
        });

      dispatch(setProductsByCategory(sortedCats));
      dispatch(setAllProducts(Object.values(sortedCats).flat()));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Shown Products
  const shownProducts =
    activeCategory === null ? allProducts : categories[activeCategory] || [];

  // ===========================
  //    EXPORT EXCEL FUNCTION
  // ===========================
  const exportToExcel = () => {
    const excelData = shownProducts.map((p, i) => ({
      SL: i + 1,
      Name: p.name,
      Price: p?.regularPrice ?? "",
      Remarks: p?.remarks ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  };

  // ===========================
  //         PRINT TABLE
  // ===========================
  const printTable = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Print Products</title>
          <style>
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

      {/* Product Table */}
      <main className="flex-1 p-6 ml-10">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === null
            ? "All Products"
            : `${activeCategory} Products`}
        </h1>

        {/* Buttons */}
        <div className="flex gap-4 mb-4">
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
                  </tr>
                </thead>

                <tbody>
                  {shownProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{product.name}</td>
                      <td className="border p-2">
                        {product?.regularPrice ?? "—"}
                      </td>
                      <td className="border p-2">
                        {product?.remarks ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Provider store={store}>
      <ProductListPage />
    </Provider>
  );
}