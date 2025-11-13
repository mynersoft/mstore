"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "@/redux/categorySlice";
import CategoryForm from "@/components/CategoryForm";

export default function CategoriesPage() {
	const dispatch = useDispatch();
	const { list: categories, loading } = useSelector(
		(state) => state.categories
	);

	const [editingCategory, setEditingCategory] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

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
		<div className="p-4 sm:p-6 space-y-6">
			<h1 className="text-2xl font-bold flex justify-between items-center">
				📦 Manage Categories
				<button
					onClick={handleAddCategory}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
					Add Category
				</button>
			</h1>

			{/* Category List */}
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sm:p-6">
				<h2 className="text-xl font-semibold mb-4">All Categories</h2>

				{loading ? (
					<p>Loading...</p>
				) : categories.length === 0 ? (
					<p className="text-gray-500">No categories found.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[500px] border-collapse">
							<thead>
								<tr className="border-b">
									<th className="p-2 text-left">Name</th>
									<th className="p-2 text-left">Subcategories</th>
									<th className="p-2 text-left">Actions</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((cat, index) => (
									<tr
										key={cat._id || index}
										className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
										<td className="p-2">{cat.name}</td>
										<td className="p-2">
											{(cat.subCategories || []).join(", ")}
										</td>
										<td className="p-2 flex gap-2 flex-wrap">
											<button
												onClick={() => handleEdit(cat)}
												className="px-3 py-1 bg-yellow-500 text-white rounded-md">
												Edit
											</button>
											<button
												onClick={() =>
													handleDelete(cat._id)
												}
												className="px-3 py-1 bg-red-600 text-white rounded-md">
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

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-lg p-6">
						<h3 className="text-lg mb-3 font-semibold">
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