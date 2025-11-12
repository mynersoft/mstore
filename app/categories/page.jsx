"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "@/redux/categorySlice";

export default function CategoriesPage() {
	const dispatch = useDispatch();
	const { list: categories, loading } = useSelector(
		(state) => state.categories
	);

	const [name, setName] = useState("");
	const [subCategories, setSubCategories] = useState("");
	const [editingCategory, setEditingCategory] = useState(null);

	// Fetch categories on mount
	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	// Add or Update category
	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			name,
			subCategories: subCategories
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		};

		if (editingCategory) {
			dispatch(updateCategory({ id: editingCategory._id, ...payload }));
		} else {
			dispatch(addCategory(payload));
		}

		setName("");
		setSubCategories("");
		setEditingCategory(null);
	};

	// Delete category
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		dispatch(deleteCategory(id));
	};

	// Edit category
	const handleEdit = (cat) => {
		setEditingCategory(cat);
		setName(cat.name);
		setSubCategories((cat.subCategories || []).join(", "));
	};

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">📦 Manage Categories</h1>

			{/* Add/Edit Form */}
			<form
				onSubmit={handleSubmit}
				className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
				<div>
					<label className="block font-medium">Category Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border rounded-md w-full p-2 mt-1"
						placeholder="Enter category name"
						required
					/>
				</div>

				<div>
					<label className="block font-medium">
						Subcategories (comma-separated)
					</label>
					<input
						type="text"
						value={subCategories}
						onChange={(e) => setSubCategories(e.target.value)}
						className="border rounded-md w-full p-2 mt-1"
						placeholder="e.g. সকেট, সুইচ, বাতি"
					/>
				</div>

				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
					{editingCategory ? "Update Category" : "Add Category"}
				</button>
			</form>

			{/* Category List */}
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4">All Categories</h2>

				{loading ? (
					<p>Loading...</p>
				) : categories.length === 0 ? (
					<p className="text-gray-500">No categories found.</p>
				) : (
					<table className="w-full border-collapse">
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
									className="border-b hover:bg-gray-50">
									<td className="p-2">{cat.name}</td>
									<td className="p-2">
										{(cat.subCategories || []).join(", ")}
									</td>
									<td className="p-2 flex gap-2">
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
				)}
			</div>
		</div>
	);
}
