// app/products/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, setPage } from "@/redux/productSlice";
import ProductFormModal from "@/components/ProductFormModal";
import AddCategoryModal from "@/components/AddCategoryModal";

export default function ProductsPage() {
	const dispatch = useDispatch();
	const {
		items,
		total,
		page: reduxPage,
		limit,
	} = useSelector((s) => s.products);
	const [pageLocal, setPageLocal] = useState(reduxPage || 1);
	const [showModal, setShowModal] = useState(false);
	const [showCatModal, setShowCatModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	useEffect(() => {
		dispatch(fetchProducts({ page: pageLocal, limit }));
	}, [dispatch, pageLocal, limit]);

	const handleDelete = async (id) => {
		if (!confirm("Delete product?")) return;
		await dispatch(deleteProduct(id)).unwrap();
		// refresh current page
		dispatch(fetchProducts({ page: pageLocal, limit }));
	};

	const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

	return (
		<div className="p-6 min-h-screen  bg-gray-950 text-gray-300">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold">Products</h1>
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setEditingProduct(null);
							setShowModal(true);
						}}
						className="bg-green-600 px-4 py-2 rounded">
						+ Add Product
					</button>
					<button
						onClick={() => {
							setShowCatModal(true);
						}}
						className="bg-green-600 px-4 py-2 rounded">
						+ Add Category
					</button>
				</div>
			</div>

			<div className="overflow-x-auto bg-gray-900 rounded-lg">
				<table className="w-full text-sm">
					<thead className="bg-gray-800">
						<tr>
							<th className="p-3 text-left">Image</th>
							<th className="p-3 text-left">Name</th>
							<th className="p-3 text-left">Category</th>
							<th className="p-3 text-left">Brand</th>
							<th className="p-3 text-left">Stock</th>
							<th className="p-3 text-left">Regular Price</th>
							<th className="p-3 text-left">Sell Price</th>
							<th className="p-3 text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items && items.length ? (
							items.map((p) => (
								<tr
									key={p._id}
									className="border-b border-gray-800 hover:bg-gray-800/40">
									<td className="p-3">
										{p.image ? (
											<img
												src={p.image}
												alt={p.name}
												className="w-10 h-10 object-cover rounded"
											/>
										) : (
											<span className="text-gray-500">
												No
											</span>
										)}
									</td>
									<td className="p-3">{p.name}</td>
									<td className="p-3">{p.category}</td>
									<td className="p-3">{p.brand}</td>
									<td className="p-3">{p.stock}</td>
									<td className="p-3">{p.regularPrice}</td>
									<td className="p-3">৳{p.sellPrice}</td>
									<td className="p-3 text-center flex gap-2 justify-center">
										<button
											onClick={() => {
												setEditingProduct(p);
												setShowModal(true);
											}}
											className="bg-blue-600 px-3 py-1 rounded">
											Edit
										</button>
										<button
											onClick={() => handleDelete(p._id)}
											className="bg-red-600 px-3 py-1 rounded">
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={8}
									className="p-6 text-center text-gray-500">
									No products
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* pagination */}
			<div className="flex justify-center gap-2 mt-4">
				{Array.from({ length: totalPages }).map((_, i) => {
					const num = i + 1;
					return (
						<button
							key={num}
							onClick={() => setPageLocal(num)}
							className={`px-3 py-1 rounded ${
								pageLocal === num
									? "bg-green-600 text-white"
									: "bg-gray-800 text-gray-400"
							}`}>
							{num}
						</button>
					);
				})}
			</div>

			{/* modal */}
			{showModal && (
				<ProductFormModal
					editingProduct={editingProduct}
					onClose={() => {
						setShowModal(false);
						setEditingProduct(null);
						dispatch(fetchProducts({ page: pageLocal, limit }));
					}}
					currentPage={pageLocal}
				/>
			)}
			{showCatModal && (
				<AddCategoryModal
					editingProduct={editingProduct}
					onClose={() => {
						setShowCatModal(false);
						setEditingProduct(null);
						// dispatch(fetchProducts({ page: pageLocal, limit }));
					}}
					currentPage={pageLocal}
				/>
			)}
		</div>
	);
}
