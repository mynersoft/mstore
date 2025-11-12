"use client";

import React, { useState, useEffect } from "react";

export default function CategoryForm({ onSubmit, editingCategory, onCancel }) {
	const [name, setName] = useState("");
	const [subCategories, setSubCategories] = useState("");

	useEffect(() => {
		if (editingCategory) {
			setName(editingCategory.name);
			setSubCategories((editingCategory.subCategories || []).join(", "));
		} else {
			setName("");
			setSubCategories("");
		}
	}, [editingCategory]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			name,
			subCategories: subCategories
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		});
		setName("");
		setSubCategories("");
	};

	return (
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

			<div className="flex gap-2">
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
					{editingCategory ? "Update Category" : "Add Category"}
				</button>
				{editingCategory && onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
