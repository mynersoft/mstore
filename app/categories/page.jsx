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
<<<<<<< HEAD
		<div className="p-4 md:p-6 space-y-6">
			{/* HEADER */}
			<h1 className="text-xl md:text-2xl font-bold flex flex-col md:flex-row justify-between gap-3 md:items-center">
=======
		<div className="p-4 sm:p-6 space-y-6">
			<h1 className="text-2xl font-bold flex justify-between items-center">
>>>>>>> 14e95ea2ea62819a05608e462f5f50ab091a4698
				📦 Manage Categories
				<button
					onClick={handleAddCategory}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto">
					Add Category
				</button>
			</h1>

			{/* Category List */}
<<<<<<< HEAD
			<div className="bg-gray-900 rounded-2xl shadow p-4 md:p-6">
				<h2 className="text-lg md:text-xl font-semibold mb-4">
					All Categories
				</h2>
=======
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sm:p-6">
				<h2 className="text-xl font-semibold mb-4">All Categories</h2>
>>>>>>> 14e95ea2ea62819a05608e462f5f50ab091a4698

				{loading ? (
					<p>Loading...</p>
				) : categories.length === 0 ? (
					<p className="text-gray-500">No categories found.</p>
				) : (
					<div className="overflow-x-auto">
<<<<<<< HEAD
						<table className="w-full border-collapse text-gray-200 ">
							<thead>
								<tr className="border-b border-gray-700 text-left">
									<th className="p-2">Name</th>
									<th className="p-2">Subcategories</th>
									<th className="p-2">Actions</th>
=======
						<table className="w-full min-w-[500px] border-collapse text-gray-200">
							<thead>
								<tr className="border-b">
									<th className="p-2 text-left">Name</th>
									<th className="p-2 text-left">Subcategories</th>
									<th className="p-2 text-left">Actions</th>
>>>>>>> 14e95ea2ea62819a05608e462f5f50ab091a4698
								</tr>
							</thead>
							<tbody>
								{categories.map((cat, index) => (
									<tr
										key={cat._id || index}
<<<<<<< HEAD
										className="border-b border-gray-800 hover:bg-gray-800">
										<td className="p-2">{cat.name}</td>
										<td className="p-2">
											{(cat.subCategories || []).join(
												", "
											)}
										</td>
										<td className="p-2 flex flex-col md:flex-row gap-2">
											<button
												onClick={() => handleEdit(cat)}
												className="px-3 py-1 bg-yellow-500 text-white rounded-md w-full md:w-auto">
=======
										className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
										<td className="p-2">{cat.name}</td>
										<td className="p-2">
											{(cat.subCategories || []).join(", ")}
										</td>
										<td className="p-2 flex gap-2 flex-wrap">
											<button
												onClick={() => handleEdit(cat)}
												className="px-3 py-1 bg-yellow-500 text-white rounded-md">
>>>>>>> 14e95ea2ea62819a05608e462f5f50ab091a4698
												Edit
											</button>
											<button
												onClick={() =>
													handleDelete(cat._id)
												}
<<<<<<< HEAD
												className="px-3 py-1 bg-red-600 text-white rounded-md w-full md:w-auto">
=======
												className="px-3 py-1 bg-red-600 text-white rounded-md">
>>>>>>> 14e95ea2ea62819a05608e462f5f50ab091a4698
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
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
					<div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-lg p-4 md:p-6">
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