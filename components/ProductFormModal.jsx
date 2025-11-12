"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProductFormModal({
	editingProduct,
	onClose,
	currentPage = 1,
}) {
	const dispatch = useDispatch();
	const { list: categories, loading: catLoading } = useSelector(
		(state) => state.categories
	);

	const [form, setForm] = useState({
		name: "",
		category: "",
		subCategory: "",
		brand: "",
		stock: 0,
		regularPrice: 0,
		sellPrice: 0,
		warranty: "",
		dealerName: "",
		image: "",
	});

	const [file, setFile] = useState(null);
	const [saving, setSaving] = useState(false);

	// Fetch categories from API
	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	// Set form values when editing
	useEffect(() => {
		if (editingProduct) {
			setForm(editingProduct);
		} else {
			setForm({
				name: "",
				category: "",
				subCategory: "",
				brand: "",
				stock: 0,
				regularPrice: '',
				sellPrice: '',
				warranty: "",
				image: "",
			});
		}
	}, [editingProduct]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);

			let imageUrl = form.image;
			if (file) {
				imageUrl = await uploadToCloudinary(file);
			}

			const payload = { ...form, image: imageUrl };

			if (editingProduct) {
				await dispatch(updateProduct(payload)).unwrap();
			} else {
				await dispatch(addProduct(payload)).unwrap();
			}

			// refresh current page
			dispatch(fetchProducts({ page: currentPage }));
			onClose();
		} catch (err) {
			alert("Save failed: " + (err.message || err));
			console.error(err);
		} finally {
			setSaving(false);
		}
	};

	// Find selected category for showing subcategories
	const selectedCategory =
		categories.find((cat) => cat.name === form.category) || {};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
			<div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-2xl p-6">
				<h3 className="text-lg mb-3 font-semibold">
					{editingProduct ? "Edit Product" : "Add Product"}
				</h3>

				<form onSubmit={handleSubmit} className="grid gap-3">
					{/* Product Name */}
					<input
						required
						placeholder="Product Name"
						value={form.name}
						onChange={(e) =>
							setForm({ ...form, name: e.target.value })
						}
						className="p-2 rounded bg-gray-800"
					/>

					{/* Category & Subcategory */}
					<div className="flex gap-2">
						<select
							required
							value={form.category}
							onChange={(e) =>
								setForm({
									...form,
									category: e.target.value,
									subCategory: "",
								})
							}
							className="p-2 rounded bg-gray-800 flex-1">
							<option value="">Select category</option>
							{catLoading ? (
								<option>Loading...</option>
							) : (
								categories.map((cat) => (
									<option key={cat.name} value={cat.name}>
										{cat.name}
									</option>
								))
							)}
						</select>

						<select
							required
							value={form.subCategory}
							onChange={(e) =>
								setForm({
									...form,
									subCategory: e.target.value,
								})
							}
							className="p-2 rounded bg-gray-800 flex-1"
							disabled={!selectedCategory.subCategories}>
							<option value="">Select subcategory</option>
							{selectedCategory.subCategories?.map((sub) => (
								<option key={sub} value={sub}>
									{sub}
								</option>
							))}
						</select>
					</div>

					{/* Brand & Stock */}
					<div className="flex gap-2 items-center">
						<input
							placeholder="Brand"
							value={form.brand}
							onChange={(e) =>
								setForm({ ...form, brand: e.target.value })
							}
							className="p-2 rounded bg-gray-800 flex-1"
						/>
						<input
							type="number"
							placeholder="Stock"
							value={form.stock}
							onChange={(e) =>
								setForm({
									...form,
									stock: Number(e.target.value),
								})
							}
							className="p-2 rounded bg-gray-800 w-32"
						/>
					</div>

					{/* Regular & Sell Price */}
					<div className="flex gap-2 items-center">
						<input
							type="number"
							placeholder="Regular Price"
							value={form.regularPrice}
							onChange={(e) =>
								setForm({
									...form,
									regularPrice: Number(e.target.value),
								})
							}
							className="p-2 rounded bg-gray-800 flex-1"
						/>
						<input
							type="number"
							placeholder="Sell Price"
							value={form.sellPrice}
							onChange={(e) =>
								setForm({
									...form,
									sellPrice: Number(e.target.value),
								})
							}
							className="p-2 rounded bg-gray-800 flex-1"
						/>
					</div>

					{/* Warranty */}
					<input
						placeholder="Warranty (e.g., 6 months)"
						value={form.warranty}
						onChange={(e) =>
							setForm({ ...form, warranty: e.target.value })
						}
						className="p-2 rounded bg-gray-800"
					/>

				

					{/* Image Upload */}
					<div className="flex items-center gap-3">
						<input
							id="img"
							type="file"
							accept="image/*"
							onChange={(e) => setFile(e.target.files[0])}
						/>
						{form.image && !file && (
							<img
								src={form.image}
								alt="preview"
								className="w-16 h-16 object-cover rounded"
							/>
						)}
						{file && (
							<img
								src={URL.createObjectURL(file)}
								alt="preview"
								className="w-16 h-16 object-cover rounded"
							/>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-2 mt-3">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1 bg-gray-700 rounded">
							Cancel
						</button>
						<button
							type="submit"
							disabled={saving}
							className="px-3 py-1 bg-green-600 rounded">
							{saving
								? "Saving..."
								: editingProduct
								? "Update"
								: "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
