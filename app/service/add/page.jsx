"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addService } from "@/redux/serviceSlice";
import { showAddConfirm } from "@/components/AddConfirm";
import { useRouter } from "next/navigation";

export default function AddServicePage() {
	const dispatch = useDispatch();
	const router = useRouter();

	const [form, setForm] = useState({
		customerName: "",
		phone: "",
		servicingeDevice: "",
		billAmount: 0,
		warranty: { hasWarranty: false, warrantyMonths: 0 },
		notes: "",
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "hasWarranty") {
			setForm((f) => ({
				...f,
				warranty: { ...f.warranty, hasWarranty: checked },
			}));
		} else if (name === "warrantyMonths") {
			setForm((f) => ({
				...f,
				warranty: { ...f.warranty, warrantyMonths: Number(value) },
			}));
		} else if (name === "billAmount") {
			setForm((f) => ({ ...f, billAmount: Number(value) }));
		} else {
			setForm((f) => ({ ...f, [name]: value }));
		}
	};

	const submit = () => {
		dispatch(addService(form))
			.unwrap()
			.then(() => router.push("/service"))
			.catch((err) =>
				alert("Failed: " + (err.message || JSON.stringify(err)))
			);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		showAddConfirm("service record", submit);
	};

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h2 className="text-xl font-bold mb-4">Add Service Record</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-3 bg-gray-900 p-4 rounded">
				<input
					name="customerName"
					value={form.customerName}
					onChange={handleChange}
					placeholder="Customer name"
					className="w-full p-2 bg-gray-800 rounded"
				/>
				<input
					name="phone"
					value={form.phone}
					onChange={handleChange}
					placeholder="Phone"
					className="w-full p-2 bg-gray-800 rounded"
				/>
				<input
					name="servicingeDevice"
					value={form.servicingeDevice}
					onChange={handleChange}
					placeholder="Device"
					required
					className="w-full p-2 bg-gray-800 rounded"
				/>
				<input
					name="billAmount"
					value={form.billAmount}
					onChange={handleChange}
					type="number"
					placeholder="Bill amount"
					className="w-full p-2 bg-gray-800 rounded"
				/>
				<div className="flex items-center gap-2">
					<input
						id="w1"
						name="hasWarranty"
						type="checkbox"
						checked={form.warranty.hasWarranty}
						onChange={handleChange}
					/>
					<label htmlFor="w1">Has warranty</label>
					{form.warranty.hasWarranty && (
						<input
							name="warrantyMonths"
							type="number"
							value={form.warranty.warrantyMonths}
							onChange={handleChange}
							className="w-24 p-1 bg-gray-800 rounded"
							placeholder="months"
						/>
					)}
				</div>
				<textarea
					name="notes"
					value={form.notes}
					onChange={handleChange}
					placeholder="Notes"
					className="w-full p-2 bg-gray-800 rounded"
				/>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-green-600 rounded">
						Save
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="px-4 py-2 bg-gray-700 rounded">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
