"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";
import ShopFilters from "@/components/ShopFillters";
import ShopList from "@/components/ShopLists";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setFiltered(items);
  }, [items]);

  const handleFilter = ({ search, sort }) => {
    let data = [...items];

    // Search Filter
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === "low") data.sort((a, b) => a.sellPrice - b.sellPrice);
    if (sort === "high") data.sort((a, b) => b.sellPrice - a.sellPrice);

    setFiltered(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Shop</h1>

      <ShopFilters onFilter={handleFilter} />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ShopList products={filtered} />
      )}
    </div>
  );
}