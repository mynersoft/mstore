"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "@/redux/productSlice";
import ProductFormModal from "@/components/ProductFormModal";
import CategoryForm from "@/components/CategoryForm";

export default function ProductsPage() {
	const dispatch = useDispatch();
	const { items, total, page: reduxPage, limit } = useSelector((s) => s.products);

	const [pageLocal, setPageLocal] = useState(reduxPage || 1);
	const [showModal, setShowModal] = useState(false);
	const [showCatModal, setShowCatModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	const [search, setSearch] = useState("");

	const handleCancel = () => setShowCatModal(false);

	useEffect(() => {
		dispatch(fetchProducts({ page: pageLocal, limit }));
	}, [dispatch, pageLocal, limit]);

	const handleDelete = async (id) => {
		if (!confirm("Delete product?")) return;
		await dispatch(deleteProduct(id)).unwrap();
		dispatch(fetchProducts({ page: pageLocal, limit }));
	};

	const filteredItems = items?.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

	return (
		<div className="p-4 md:p-6 min-h-screen bg-gray-950 text-gray-300">

			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:justify-between gap-3 md:items-center mb-6">
				<h1 className="text-2xl font-semibold">Products</h1>

				{/* Search */}
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search product..."
					className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-300 w-full md:w-60"
				/>

				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setEditingProduct(null);
							setShowModal(true);
						}}
						className="bg-green-600 px-4 py-2 rounded text-sm">
						+ Add Product
					</button>

					<button
						onClick={() => setShowCatModal(true)}
						className="bg-green-600 px-4 py-2 rounded text-sm">
						+ Add Category
					</button>
				</div>
			</div>

			{/* DESKTOP TABLE (hidden on mobile) */}
			<div className="hidden md:block overflow-x-auto bg-gray-900 rounded-lg">
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
						{filteredItems?.length ? (
							filteredItems.map((p) => (
								<tr key={p._id}
									className="border-b border-gray-800 hover:bg-gray-800/40">
									<td className="p-3">
										{p.image ? (
											<img src={p.image} className="w-10 h-10 object-cover rounded" />
										) : <span className="text-gray-500">No</span>}
									</td>
									<td className="p-3">{p.name}</td>
									<td className="p-3">{p.category}</td>
									<td className="p-3">{p.brand}</td>
									<td className="p-3">{p.stock}</td>
									<td className="p-3">{p.regularPrice}</td>
									<td className="p-3">{p.sellPrice}</td>

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
								<td colSpan={8} className="p-6 text-center text-gray-500">
									No products found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* MOBILE CARD VIEW */}
			<div className="md:hidden space-y-4">
				{filteredItems?.length ? (
					filteredItems.map((p) => (
						<div
							key={p._id}
							className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800"
						>
							<div className="flex items-center gap-3">
								<img
									src={p.image}
									className="w-14 h-14 rounded object-cover"
								/>
								<div>
									<h2 className="font-semibold">{p.name}</h2>
									<p className="text-gray-400 text-sm">
										{p.category} • {p.brand}
									</p>
								</div>
							</div>

							<div className="mt-3 grid grid-cols-2 text-sm">

<p>Regular price {p.regularPrice}</p>
								<p>Stock: {p.stock}</p>
								
								<p>Sell price: {p.sellPrice}</p>
							</div>

							<div className="flex gap-2 mt-3">
								<button
									onClick={() => {
										setEditingProduct(p);
										setShowModal(true);
									}}
									className="bg-blue-600 px-3 py-1 rounded w-full"
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(p._id)}
									className="bg-red-600 px-3 py-1 rounded w-full"
								>
									Delete
								</button>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-gray-500">
						No products found
					</p>
				)}
			</div>

			{/* PAGINATION */}
			<div className="flex justify-center gap-2 mt-6 flex-wrap">
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

			{/* PRODUCT MODAL */}
			{showModal && (
				<ProductFormModal
					open={showModal}
					editingProduct={editingProduct}
					onClose={() => {
						setShowModal(false);
						setEditingProduct(null);
						dispatch(fetchProducts({ page: pageLocal, limit }));
					}}
				/>
			)}

			{/* CATEGORY MODAL */}
			{showCatModal && (
				<CategoryForm
					onCancel={handleCancel}
					onClose={() => {
						setShowCatModal(false);
						setEditingProduct(null);
					}}
					currentPage={pageLocal}
				/>
			)}
		</div>
	);
}