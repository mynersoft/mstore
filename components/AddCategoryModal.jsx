"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCategory, updateCategory } from "@/redux/categorySlice";

export default function AddCategoryModal({ editingCategory, onClose }) {
	const dispatch = useDispatch();
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
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-md p-6">
				<h3 className="text-lg mb-3 font-semibold">
					{editingCategory ? "Edit Category" : "Add Category"}
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block font-medium">
							Category Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border rounded-md w-full p-2 mt-1 bg-gray-800 text-white"
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
							className="border rounded-md w-full p-2 mt-1 bg-gray-800 text-white"
							placeholder="e.g. সকেট, সুইচ, বাতি"
						/>
					</div>

					<div className="flex justify-end gap-2 mt-3">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1 bg-gray-700 rounded-md">
							Cancel
						</button>
						<button
							type="submit"
							className="px-3 py-1 bg-blue-600 rounded-md text-white">
							{editingCategory ? "Update" : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
