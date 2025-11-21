"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "@/redux/categorySlice";
import CategoryForm from "@/components/CategoryForm";
import AddCategoryButton from "@/components/AddCategoryButton";

export default function CategoriesPage() {
	const dispatch = useDispatch();
	const { list: categories, loading } = useSelector(
		(state) => state.categories
	);

	const [editingCategory, setEditingCategory] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const handleSubmit = (payload) => {
		if (editingCategory) {
			dispatch(updateCategory({ id: editingCategory._id, ...payload }));
		} else {
			dispatch(addCategory(payload));
		}
		setEditingCategory(null);
		setShowModal(false);
	};

	const handleDelete = (id) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		dispatch(deleteCategory(id));
	};

	const handleEdit = (cat) => {
		setEditingCategory(cat);
		setShowModal(true);
	};

	const handleAddCategory = () => {
		setEditingCategory(null);
		setShowModal(true);
	};

	const handleCancel = () => {
		setEditingCategory(null);
		setShowModal(false);
	};

	return (
		<div className="p-4 sm:p-6 space-y-6 bg-[#0c0c0f] min-h-screen text-gray-200">
			
			<h1 className="text-2xl font-bold flex justify-between items-center">
				<span>📦 Manage Categories</span>

				{/* Reusable Component */}
				<AddCategoryButton onClick={handleAddCategory} />
			</h1>

			<div className="bg-[#131318] border border-gray-800 rounded-2xl shadow-xl p-4 sm:p-6">
				<h2 className="text-xl font-semibold mb-4">All Categories</h2>

				{loading ? (
					<p className="text-gray-400">Loading...</p>
				) : categories.length === 0 ? (
					<p className="text-gray-500">No categories found.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[500px] border-collapse">
							<thead>
								<tr className="bg-[#1a1a20] border-b border-gray-800">
									<th className="p-3 text-left text-gray-300">Name</th>
									<th className="p-3 text-left text-gray-300">Subcategories</th>
									<th className="p-3 text-left text-gray-300">Actions</th>
								</tr>
							</thead>

							<tbody>
								{categories.map((cat) => (
									<tr
										key={cat._id}
										className="border-b border-gray-800 bg-[#0e0e11] hover:bg-[#16161c] transition-colors"
									>
										<td className="p-3">{cat.name}</td>
										<td className="p-3 text-gray-400">
											{(cat.subCategories || []).join(", ")}
										</td>
										<td className="p-3 flex gap-2 flex-wrap">
											<button
												onClick={() => handleEdit(cat)}
												className="px-3 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition-all"
											>
												Edit
											</button>

											<button
												onClick={() => handleDelete(cat._id)}
												className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
					<div className="bg-[#1a1a1f] border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-xl">
						<h3 className="text-lg mb-4 font-semibold text-gray-100">
							{editingCategory ? "Edit Category" : "Add Category"}
						</h3>

						<CategoryForm
							onSubmit={handleSubmit}
							editingCategory={editingCategory}
							onCancel={handleCancel}
						/>
					</div>
				</div>
			)}
		</div>
	);
}