"use client";

import { useSelector, useDispatch } from "react-redux";
import {
	deleteProduct,
	addProduct,
	updateProduct,
	setEditingProduct,
} from "@/redux/productSlice";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

// Simple Modal component
function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
				{children}
				<div className="mt-4 flex justify-end">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function ProductTable({ productsProp }) {
	const dispatch = useDispatch();
	const products =
		productsProp || useSelector((state) => state.products.products);
	const editingProduct = useSelector((state) => state.products.editingProduct);

	const [search, setSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock: "",
	});

	useEffect(() => {
		if (editingProduct) {
			setFormData({
				name: editingProduct.name,
				price: editingProduct.price,
				stock: editingProduct.stock,
			});
			setIsModalOpen(true);
		} else {
			setFormData({ name: "", price: "", stock: "" });
		}
	}, [editingProduct]);

	const handleDelete = (id) => {
		if (confirm("Are you sure you want to delete this product?")) {
			dispatch(deleteProduct(id));
		}
	};

	const handleEdit = (product) => {
		dispatch(setEditingProduct(product));
	};

	const handleAdd = () => {
		dispatch(setEditingProduct(null)); // reset editing
		setIsModalOpen(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { name, price, stock } = formData;
		if (!name || !price || !stock) return alert("All fields are required");

		if (editingProduct) {
			dispatch(
				updateProduct({
					...editingProduct,
					name,
					price: Number(price),
					stock: Number(stock),
				})
			);
		} else {
			dispatch(
				addProduct({
					id: Date.now(),
					name,
					price: Number(price),
					stock: Number(stock),
					sold: 0,
				})
			);
		}

		setIsModalOpen(false);
		setFormData({ name: "", price: "", stock: "" });
	};

	// Filter products by search
	const filtered = products.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="overflow-x-auto rounded-lg shadow mt-4">
			<div className="flex justify-between mb-3">
				<input
					type="text"
					placeholder="Search product..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="border px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button onClick={handleAdd} variant="default">
					<Plus className="w-4 h-4 mr-1" /> Add Product
				</Button>
			</div>

			<table className="min-w-full bg-white border border-gray-200">
				<thead className="bg-gray-100 text-gray-700">
					<tr>
						<th className="py-3 px-4 border-b text-left">#</th>
						<th className="py-3 px-4 border-b text-left">
							Product Name
						</th>
						<th className="py-3 px-4 border-b text-left">
							Price (৳)
						</th>
						<th className="py-3 px-4 border-b text-left">Stock</th>
						<th className="py-3 px-4 border-b text-center">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{filtered.length > 0 ? (
						filtered.map((p, index) => (
							<tr
								key={p.id}
								className="hover:bg-gray-50 transition-colors duration-200">
								<td className="py-3 px-4 border-b">
									{index + 1}
								</td>
								<td className="py-3 px-4 border-b font-medium">
									{p.name}
								</td>
								<td className="py-3 px-4 border-b">
									{p.price}
								</td>
								<td className="py-3 px-4 border-b">
									{p.stock}
								</td>
								<td className="py-3 px-4 border-b text-center space-x-2">
									<Button
										onClick={() => handleEdit(p)}
										variant="outline"
										size="sm">
										<Pencil className="w-4 h-4 mr-1" /> Edit
									</Button>
									<Button
										onClick={() => handleDelete(p.id)}
										variant="destructive"
										size="sm">
										<Trash2 className="w-4 h-4 mr-1" />{" "}
										Delete
									</Button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan="5"
								className="text-center py-5 text-gray-500 font-medium">
								No products found.
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Modal */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<h2 className="text-xl font-semibold mb-4">
					{editingProduct ? "Edit Product" : "Add Product"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-1 font-medium">
							Product Name
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label className="block mb-1 font-medium">
							Price (৳)
						</label>
						<input
							type="number"
							value={formData.price}
							onChange={(e) =>
								setFormData({
									...formData,
									price: e.target.value,
								})
							}
							className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label className="block mb-1 font-medium">Stock</label>
						<input
							type="number"
							value={formData.stock}
							onChange={(e) =>
								setFormData({
									...formData,
									stock: e.target.value,
								})
							}
							className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<Button type="submit" variant="default">
							{editingProduct ? "Update" : "Add"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
