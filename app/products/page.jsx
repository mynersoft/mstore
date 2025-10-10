"use client";

import React from "react";
import ProductTable from "@/components/ProductTable";

export default function ProductsPage() {
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">📦 Product List</h1>
			<p className="text-gray-500">
				Manage your products, stock, and pricing here.
			</p>

			{/* Product Table */}
			<ProductTable />
		</div>
	);
}
