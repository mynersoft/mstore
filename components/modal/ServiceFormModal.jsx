"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addService, updateService } from "@/redux/serviceSlice";
import { showAddConfirm } from "@/components/sweetalert/AddConfirm";

export default function ServiceFormModal({
	open,
	mode,
	currentRecord,
	onClose,
}) {
    const dispatch = useDispatch();
    
  
    

	const [form, setForm] = useState({
		customerName: "",
		phone: "",
		servicingeDevice: "",
		billAmount: 0,
		warranty: { hasWarranty: false, warrantyMonths: 0 },
		notes: "",
	});

	useEffect(() => {
		if (mode === "edit" && currentRecord) {
			setForm({
				customerName: currentRecord.customerName || "",
				phone: currentRecord.phone || "",
				servicingeDevice: currentRecord.servicingeDevice || "",
				billAmount: currentRecord.billAmount || 0,
				warranty: currentRecord.warranty || {
					hasWarranty: false,
					warrantyMonths: 0,
				},
				notes: currentRecord.notes || "",
			});
		} else if (mode === "add") {
			setForm({
				customerName: "",
				phone: "",
				servicingeDevice: "",
				billAmount: 0,
				warranty: { hasWarranty: false, warrantyMonths: 0 },
				notes: "",
			});
		}
	}, [mode, currentRecord]);

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

	const submit = async () => {
		if (mode === "add") {
			await dispatch(addService(form)).unwrap();
		} else if (mode === "edit" && currentRecord) {
			await dispatch(
				updateService({ id: currentRecord._id, payload: form })
			).unwrap();
		}
		onClose();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		showAddConfirm(
			mode === "add" ? "service record" : "update service",
			submit
		);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-gray-900 p-6 rounded w-full max-w-md">
				<h2 className="text-xl text-gray-300 font-bold mb-4">
					{mode === "add"
						? "Add Service Record"
						: "Edit Service Record"}
				</h2>
				<form className="space-y-3" onSubmit={handleSubmit}>
					<input
						name="customerName"
						value={form.customerName}
						onChange={handleChange}
						placeholder="Customer name"
						className="w-full p-2 text-gray-300 bg-gray-800 rounded"
					/>
					<input
						name="phone"
						value={form.phone}
						onChange={handleChange}
						placeholder="Phone"
						className="w-full p-2 text-gray-300 bg-gray-800 rounded"
					/>
					<input
						name="servicingeDevice"
						value={form.servicingeDevice}
						onChange={handleChange}
						placeholder="Device"
						required
						className="w-full p-2 text-gray-300 bg-gray-800 rounded"
					/>
					<input
						name="billAmount"
						value={form.billAmount}
						onChange={handleChange}
						type="number"
						placeholder="Bill amount"
						className="w-full p-2 text-gray-300 bg-gray-800 rounded"
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
						className="w-full p-2 text-gray-300 bg-gray-800 rounded"
					/>

					<div className="flex gap-2">
						<button
							type="submit"
							className="px-4 py-2 bg-green-600 rounded">
							{mode === "add" ? "Save" : "Update"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-700 rounded">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
