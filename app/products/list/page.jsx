"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import * as XLSX from "xlsx";

// Redux Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: {},
    allProducts: [],
    activeCategory: null,
    loading: false,
    sidebarOpen: true,
    searchText: "",
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
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
  },
});

const {
  setProductsByCategory,
  setAllProducts,
  setActiveCategory,
  setLoading,
  toggleSidebar,
  setSearchText,
} = productSlice.actions;

// Store
const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
});

function ProductListPage() {
  const dispatch = useDispatch();
  const { categories, allProducts, activeCategory, loading, sidebarOpen, searchText } =
    useSelector((state) => state.products);

  const [localProducts, setLocalProducts] = useState([]); // for inline update

  // Load API
  const loadData = async () => {
    try {
      dispatch(setLoading(true));

      const res = await fetch("/api/products/getbycat");
      const data = await res.json();

      let cats = data.categories || {};

      // Sort categories alphabetically
      const sortedCats = {};
      Object.keys(cats)
        .sort((a, b) => a.localeCompare(b))
        .forEach((key) => (sortedCats[key] = cats[key]));

      dispatch(setProductsByCategory(sortedCats));
      const flat = Object.values(sortedCats).flat();
      dispatch(setAllProducts(flat));
      setLocalProducts(flat);

      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = localProducts.filter((p) =>
  (p.name ?? "").toLowerCase().includes((searchText ?? "").toLowerCase())
);









  // Category Filter
  const shownProducts =
    activeCategory === null
      ? filteredProducts
      : filteredProducts.filter((p) => p.category === activeCategory);

  // Update Price (Only Price Updates)
  const updatePrice = async (id, newPrice) => {
    try {
      const formData = new FormData();
      formData.append("regularPrice", newPrice);

      const res = await fetch(`/api/products/${id}/uodatebyprice`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        alert("Price update failed");
        return;
      }

      alert("Price updated");
      loadData();
    } catch (err) {
      alert("Price update failed");
    }
  };

  // Export Excel
  const exportToExcel = () => {
    const excelData = shownProducts.map((p, i) => ({
      SL: i + 1,
      Name: p.name,
      Price: p.regularPrice ?? "",
      Remarks: p.remarks ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  const printTable = () => {
  const rows = Array.from(
    document.querySelectorAll("#print-area table tbody tr")
  );

  let tableRows = "";

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td");

    const sl = cells[0]?.innerText || "";
    const name = cells[1]?.innerText || "";
    const priceInput = cells[2]?.querySelector("input");
    const regularPrice = priceInput ? priceInput.value : cells[2]?.innerText;
    const remarks = cells[4]?.innerText || "";

    tableRows += `
      <tr>
        <td>${sl}</td>
        <td>${name}</td>
        <td>${regularPrice}</td>
        <td>${regularPrice}</td> <!-- Update Price column -->
        <td>${remarks}</td>
      </tr>
    `;
  });

  const win = window.open("", "", "width=900,height=600");
  win.document.write(`
    <html>
    <head>
      <style>
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background: #eee; }
      </style>
    </head>
    <body>

      <h3 style="text-align:center;margin-bottom:10px;">Product Price List</h3>

      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Product Name</th>
            <th>Regular Price</th>
            <th>Update Price</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

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
        {sidebarOpen ? "Hide" : "Show"}
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

            {Object.keys(categories).map((cat) => (
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

      {/* Main Table */}
      <main className="flex-1 p-6 ml-10">
        <h1 className="text-2xl font-bold mb-4">
          {activeCategory === null ? "All Products" : activeCategory}
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          className="border px-3 py-2 mb-4 w-72"
          value={searchText}
          onChange={(e) => dispatch(setSearchText(e.target.value))}
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-4">
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
            Export Excel
          </button>
          <button onClick={printTable} className="bg-blue-600 text-white px-4 py-2 rounded">
            Print
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {/* PRINT AREA */}
        <div id="print-area">
          {!loading && shownProducts.length > 0 && (
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">SL</th>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Regular Price</th>
                  <th className="border p-2">Save</th>
                  <th className="border p-2">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {shownProducts.map((p, i) => (
                  <tr key={p._id}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{p.name}</td>

                    {/* Inline Price Edit */}
                    <td className="border p-2">
                      <input
                        type="number"
                        value={p.regularPrice || ""}
                        onChange={(e) => {
                          p.regularPrice = e.target.value;
                          setLocalProducts([...localProducts]);
                        }}
                        className="border px-2 py-1 w-28"
                      />
                    </td>

                    {/* Save Button */}
                    <td className="border p-2">
                      <button
                        onClick={() => updatePrice(p._id, p.regularPrice)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    </td>

                    <td className="border p-2">{p.remarks || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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