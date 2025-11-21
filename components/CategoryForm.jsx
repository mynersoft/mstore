"use client";

import React, { useState, useEffect } from "react";

export default function CategoryForm({ onSubmit, editingCategory, onCancel }) {
	const [name, setName] = useState("");
	const [subCategories, setSubCategories] = useState("");

	useEffect(() => {
		if (editingCategory) {
			setName(editingCategory.name || "");
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
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-[#131318] border border-gray-800 rounded-2xl shadow p-6 space-y-4 text-gray-200"
		>
			<div>
				<label className="block font-medium mb-1">
					Category Name
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border border-gray-700 bg-[#0e0e11] text-gray-200 rounded-md w-full p-2"
					placeholder="Enter category name"
					required
				/>
			</div>

			<div>
				<label className="block font-medium mb-1">
					Subcategories (comma-separated)
				</label>
				<input
					type="text"
					value={subCategories}
					onChange={(e) => setSubCategories(e.target.value)}
					className="border border-gray-700 bg-[#0e0e11] text-gray-200 rounded-md w-full p-2"
					placeholder="e.g. সকেট, সুইচ, বাতি"
				/>
			</div>

			<div className="flex gap-2 pt-2">
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
				>
					{editingCategory ? "Update Category" : "Add Category"}
				</button>

				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}