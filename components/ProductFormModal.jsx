"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import { showAddConfirm } from "./sweetalert/AddConfirm";

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
		stock: "",
		regularPrice: "",
		sellPrice: "",
		warranty: "",
		image: "",
	});
const [loading, setLoading] = useState(false);
const{name,
		category,
		subCategory,
		brand,
		stock,
		regularPrice,
		sellPrice,
		warranty,
		image} = form;
	const [file, setFile] = useState(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	useEffect(() => {
		if (editingProduct) {
			setForm(editingProduct);
		} else {
			setForm({
				name: "",
				category: "",
				subCategory: "",
				brand: "",
				stock: "",
				regularPrice: "",
				sellPrice: "",
				warranty: "",
				image: "",
			});
		}
	}, [editingProduct]);

	const focusScroll = (e) => {
		e.target.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};







  async function handleSubmit() {
    if (!form.image) return alert("Image required");
    if (!name || !sellPrice ||! regularPrice ) return alert("Input fields missing");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("sellPrice", sellPrice);
formData.append("regularPrice",regularPrice);
      formData.append("brand",brand);
formData.append("stock",stock);
formData.append("warranty",warranty);
formData.append("category ",category );
formData.append("subCategory",subCategory );



      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product saved!");
        console.log(data);
      } 

if (editingProduct) {
				await dispatch(updateProduct(payload)).unwrap();
			} else {
				showAddConfirm("product", () =>
					dispatch(addProduct(payload)).unwrap()
				);


else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }




			dispatch(fetchProducts({ page: currentPage }));
			onClose();
		} catch (err) {
			alert("Save failed: " + (err.message || err));
		} finally {
			setSaving(false);
		}
	};

	const selectedCategory =
		categories.find((cat) => cat.name === form.category) || {};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:p-4">
			<div className="bg-gray-900 text-gray-100 rounded-lg w-full max-w-2xl 
                max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl 
                scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
				
				{/* Header */}
				<div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-3">
					<h3 className="text-lg font-semibold">
						{editingProduct ? "Edit Product" : "Add Product"}
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-200 text-xl">
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="grid gap-4">
					{/* Product Name */}
					<div className="flex flex-col gap-1">
						<label className="text-gray-300">Product Name</label>
						<input
							required
							placeholder="Product Name"
							value={form.name}
							onFocus={focusScroll}
							onChange={(e) =>
								setForm({ ...form, name: e.target.value })
							}
							className="p-3 rounded bg-gray-800 w-full text-base"
						/>
					</div>

					{/* Category & Subcategory */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Category</label>
							<select
								required
								value={form.category}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({
										...form,
										category: e.target.value,
										subCategory: "",
									})
								}
								className="p-3 rounded bg-gray-800 w-full text-base">
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
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Subcategory</label>
							<select
								required
								value={form.subCategory}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({
										...form,
										subCategory: e.target.value,
									})
								}
								className="p-3 rounded bg-gray-800 w-full text-base"
								disabled={!selectedCategory.subCategories}>
								<option value="">Select subcategory</option>
								{selectedCategory.subCategories?.map((sub) => (
									<option key={sub} value={sub}>
										{sub}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Brand & Stock */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Brand</label>
							<input
								placeholder="Brand"
								value={form.brand}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({ ...form, brand: e.target.value })
								}
								className="p-3 rounded bg-gray-800 w-full text-base"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Stock</label>
							<input
								type="number"
								placeholder="Stock"
								value={form.stock}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({
										...form,
										stock: Number(e.target.value),
									})
								}
								className="p-3 rounded bg-gray-800 w-full text-base"
							/>
						</div>
					</div>

					{/* Prices */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Regular Price</label>
							<input
								type="number"
								placeholder="Regular Price"
								value={form.regularPrice}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({
										...form,
										regularPrice: Number(e.target.value),
									})
								}
								className="p-3 rounded bg-gray-800 w-full text-base"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-gray-300">Sell Price</label>
							<input
								type="number"
								placeholder="Sell Price"
								value={form.sellPrice}
								onFocus={focusScroll}
								onChange={(e) =>
									setForm({
										...form,
										sellPrice: Number(e.target.value),
									})
								}
								className="p-3 rounded bg-gray-800 w-full text-base"
							/>
						</div>
					</div>

					{/* Warranty */}
					<div className="flex flex-col gap-1">
						<label className="text-gray-300">Warranty</label>
						<input
							placeholder="Warranty (e.g., 6 months)"
							value={form.warranty}
							onFocus={focusScroll}
							onChange={(e) =>
								setForm({ ...form, warranty: e.target.value })
							}
							className="p-3 rounded bg-gray-800 w-full text-base"
						/>
					</div>

					{/* Image Upload */}
					<div className="flex flex-col gap-1">
						<label className="text-gray-300">Product Image</label>
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
							<input
								id="img"
								type="file"
								accept="image/*"
								onFocus={focusScroll}
								onChange={(e) => setFile(e.target.files[0])}
								className="text-sm"
							/>
							<div className="flex gap-2">
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
						</div>
					</div>

					{/* Buttons */}
					<div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded w-full sm:w-auto">
							Cancel
						</button>

						<button
							type="submit"
							disabled={saving}
							className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded w-full sm:w-auto">
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