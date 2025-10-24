"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Fixed Modal component
function Modal({ open, onClose, children }) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
			<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg w-full max-w-2xl p-6">
				{children}
				<div className="mt-4 flex justify-end">
					<button
						onClick={onClose}
						className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700">
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ServicePage() {
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(false);
  
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState({
		customerName: "",
		phone: "",
		deviceName: "",
		billAmount: "",
		warranty: { hasWarranty: false, warrantyMonths: 0 },
		notes: "",
		receivedAt: "",
		status: "received",
	});

	// ✅ Fetch all records
	const fetchRecords = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/service-records");
			const data = await res.json();
			setRecords(data || []);
		} catch (err) {
			console.error("Fetch error", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecords();
	}, []);

	// ✅ Calculations
	const totalBill = records.reduce(
		(sum, r) => sum + Number(r.billAmount || 0),
		0
	);
	const totalServices = records.length;
	const inProgress = records.filter((r) => r.status === "in_progress").length;
	const delivered = records.filter((r) => r.status === "delivered").length;

	// ✅ PDF Download
	const downloadPDF = () => {
		const doc = new jsPDF();
		doc.text("Service Report", 14, 15);
		doc.autoTable({
			head: [
				["#", "Name", "Phone", "Device", "Bill", "Warranty", "Status"],
			],
			body: records.map((s, i) => [
				i + 1,
				s.customerName,
				s.phone,
				s.deviceName,
				`৳${s.billAmount}`,
				s.warranty?.hasWarranty
					? `${s.warranty?.warrantyMonths} mo`
					: "No",
				s.status,
			]),
			startY: 25,
		});
		doc.text(
			`Total Services: ${totalServices}`,
			14,
			doc.lastAutoTable.finalY + 10
		);
		doc.text(`Delivered: ${delivered}`, 14, doc.lastAutoTable.finalY + 20);
		doc.text(
			`In Progress: ${inProgress}`,
			14,
			doc.lastAutoTable.finalY + 30
		);
		doc.text(
			`Total Service Bill: ৳${totalBill}`,
			14,
			doc.lastAutoTable.finalY + 40
		);
		doc.save("service_report.pdf");
	};

	// ✅ Add/Edit modal open
	const openAdd = () => {
		setEditing(null);
		setForm({
			customerName: "",
			phone: "",
			deviceName: "",
			billAmount: "",
			warranty: { hasWarranty: false, warrantyMonths: 0 },
			notes: "",
			receivedAt: "",
			status: "received",
		});
		setIsModalOpen(true);
	};

	const openEdit = (rec) => {
		setEditing(rec);
		setForm({
			customerName: rec.customerName || "",
			phone: rec.phone || "",
			deviceName: rec.deviceName || "",
			billAmount: rec.billAmount || 0,
			warranty: rec.warranty || { hasWarranty: false, warrantyMonths: 0 },
			notes: rec.notes || "",
			receivedAt: rec.receivedAt
				? new Date(rec.receivedAt).toISOString().slice(0, 10)
				: "",
			status: rec.status || "received",
		});
		setIsModalOpen(true);
	};

	// ✅ Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.customerName || !form.phone || !form.deviceName) {
			alert("Customer name, phone and device name are required");
			return;
		}

		const payload = {
			...form,
			billAmount: Number(form.billAmount) || 0,
			warranty: {
				hasWarranty: !!form.warranty.hasWarranty,
				warrantyMonths: Number(form.warranty.warrantyMonths) || 0,
			},
		};

		try {
			let res;
			if (editing) {
				res = await fetch(`/api/service-records/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			} else {
				res = await fetch("/api/service-records", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			}

			if (!res.ok) {
				const err = await res.json();
				alert("Error: " + (err?.error || res.statusText));
				return;
			}

			await fetchRecords();
			setIsModalOpen(false);
			setEditing(null);
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete this record?")) return;
		try {
			const res = await fetch(`/api/service-records/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json();
				alert("Error: " + (err?.error || res.statusText));
				return;
			}
			await fetchRecords();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="p-6 text-gray-700 dark:text-gray-300">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">📱 Service Dashboard</h1>
				<div className="space-x-2">
					<button
						onClick={downloadPDF}
						className="bg-green-600 text-white px-4 py-2 rounded">
						📄 Download PDF
					</button>
					<button
						onClick={openAdd}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
						+ Add Record
					</button>
				</div>
			</div>

			{/* ✅ Dashboard Summary */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
					<p>Total Services</p>
					<p className="text-2xl font-bold">{totalServices}</p>
				</div>
				<div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center">
					<p>In Progress</p>
					<p className="text-2xl font-bold">{inProgress}</p>
				</div>
				<div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center">
					<p>Delivered</p>
					<p className="text-2xl font-bold">{delivered}</p>
				</div>
				<div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg text-center">
					<p>Total Bill</p>
					<p className="text-2xl font-bold">
						৳{totalBill.toLocaleString()}
					</p>
				</div>
			</div>

			{/* ✅ Table */}
			<div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
				{loading ? (
					<p className="text-gray-500">Loading…</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead className="text-left border-b">
								<tr>
									<th className="p-2">#</th>
									<th className="p-2">Customer</th>
									<th className="p-2">Phone</th>
									<th className="p-2">Device</th>
									<th className="p-2">Bill (৳)</th>
									<th className="p-2">Warranty</th>
									<th className="p-2">Received</th>
									<th className="p-2">Status</th>
									<th className="p-2 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{records.map((r, i) => (
									<tr
										key={r._id}
										className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
										<td className="p-2">{i + 1}</td>
										<td className="p-2">
											{r.customerName}
										</td>
										<td className="p-2">{r.phone}</td>
										<td className="p-2">{r.deviceName}</td>
										<td className="p-2">৳{r.billAmount}</td>
										<td className="p-2">
											{r.warranty?.hasWarranty
												? `${r.warranty?.warrantyMonths} mo`
												: "No"}
										</td>
										<td className="p-2">
											{r.receivedAt
												? new Date(
														r.receivedAt
												  ).toLocaleDateString()
												: "-"}
										</td>
										<td className="p-2">{r.status}</td>
										<td className="p-2 text-center space-x-2">
											<button
												onClick={() => openEdit(r)}
												className="px-2 py-1 bg-yellow-500 text-white rounded">
												Edit
											</button>
											<button
												onClick={() =>
													handleDelete(r._id)
												}
												className="px-2 py-1 bg-red-600 text-white rounded">
												Delete
											</button>
										</td>
									</tr>
								))}
								{records.length === 0 && (
									<tr>
										<td
											colSpan="9"
											className="p-4 text-center text-gray-500">
											No records yet.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* ✅ Modal */}
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<h2 className="text-xl font-semibold mb-4">
					{editing ? "Edit Service Record" : "Add Service Record"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						type="text"
						placeholder="Customer Name"
						value={form.customerName}
						onChange={(e) =>
							setForm({ ...form, customerName: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<input
						type="text"
						placeholder="Phone"
						value={form.phone}
						onChange={(e) =>
							setForm({ ...form, phone: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<input
						type="text"
						placeholder="Device Name"
						value={form.deviceName}
						onChange={(e) =>
							setForm({ ...form, deviceName: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<input
						type="number"
						placeholder="Bill Amount"
						value={form.billAmount}
						onChange={(e) =>
							setForm({ ...form, billAmount: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<div className="flex items-center space-x-3">
						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={form.warranty.hasWarranty}
								onChange={(e) =>
									setForm({
										...form,
										warranty: {
											...form.warranty,
											hasWarranty: e.target.checked,
										},
									})
								}
							/>
							<span>Has Warranty</span>
						</label>
						{form.warranty.hasWarranty && (
							<input
								type="number"
								placeholder="Warranty (months)"
								value={form.warranty.warrantyMonths}
								onChange={(e) =>
									setForm({
										...form,
										warranty: {
											...form.warranty,
											warrantyMonths: e.target.value,
										},
									})
								}
								className="w-32 p-2 rounded bg-gray-100 dark:bg-gray-800"
							/>
						)}
					</div>
					<textarea
						placeholder="Notes"
						value={form.notes}
						onChange={(e) =>
							setForm({ ...form, notes: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<input
						type="date"
						value={form.receivedAt}
						onChange={(e) =>
							setForm({ ...form, receivedAt: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
					/>
					<select
						value={form.status}
						onChange={(e) =>
							setForm({ ...form, status: e.target.value })
						}
						className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800">
						<option value="received">Received</option>
						<option value="in_progress">In Progress</option>
						<option value="delivered">Delivered</option>
					</select>
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
						{editing ? "Update" : "Add"}
					</button>
				</form>
			</Modal>
		</div>
	);
}
