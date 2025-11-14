"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchServices,
	deleteService,
	fetchServiceStats,
} from "@/redux/serviceSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showDeleteConfirm } from "@/components/sweetalert/DeleteConfirm";

export default function ServiceListPage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { list, loading, total, stats } = useSelector((s) => s.service);

	useEffect(() => {
		dispatch(fetchServiceStats({ type: "daily" })); // initial stats
	}, [dispatch]);

	const handleDelete = (id) => {
		showDeleteConfirm("service record", () => dispatch(deleteService(id)));
	};

	const printRecord = (record) => {
		// open printable window
		const html = `
      <html>
      <head>
        <style>
          body{font-family: Arial; padding:20px;}
          table{width:100%; border-collapse: collapse;}
          th, td{border:1px solid #ccc; padding:8px; text-align:left;}
        </style>
      </head>
      <body>
        <h2>Service Record</h2>
        <p><strong>Invoice/ID:</strong> ${record._id}</p>
        <p><strong>Customer:</strong> ${record.customerName || "N/A"}</p>
        <p><strong>Phone:</strong> ${record.phone || "N/A"}</p>
        <p><strong>Device:</strong> ${record.servicingeDevice}</p>
        <p><strong>Bill:</strong> ${record.billAmount} Tk</p>
        <p><strong>Warranty:</strong> ${
			record.warranty?.hasWarranty
				? record.warranty.warrantyMonths + " months"
				: "No"
		}</p>
        <p><strong>Notes:</strong> ${record.notes || ""}</p>
        <hr/>
        <p>Printed: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `;
		const w = window.open("", "", "width=800,height=900");
		w.document.write(html);
		w.document.close();
		w.print();
	};

	// totals cards
	const totalServices = stats?.totalCount ?? 0;
	const totalBill = stats?.totalBills ?? 0;

	return (
		<div className="p-6">
			<div className="flex gap-4 mb-4">
				<div className="bg-gray-800 p-4 rounded shadow">
					<div className="text-sm text-gray-400">
						Total services (day)
					</div>
					<div className="text-2xl font-bold">{totalServices}</div>
				</div>
				<div className="bg-gray-800 p-4 rounded shadow">
					<div className="text-sm text-gray-400">
						Total bill (day)
					</div>
					<div className="text-2xl font-bold">{totalBill} Tk</div>
				</div>
				<Link
					href="/service/add"
					className="ml-auto bg-green-600 px-4 py-2 rounded">
					Add Service
				</Link>
			</div>

			<div className="bg-gray-900 p-4 rounded">
				<table className="w-full text-sm">
					<thead className="text-left">
						<tr>
							<th className="p-2">ID</th>
							<th className="p-2">Customer</th>
							<th className="p-2">Phone</th>
							<th className="p-2">Device</th>
							<th className="p-2 text-right">Bill</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{list.map((rec) => (
							<tr
								key={rec._id}
								className="border-t border-gray-800">
								<td className="p-2">{rec._id}</td>
								<td className="p-2">{rec.customerName}</td>
								<td className="p-2">{rec.phone}</td>
								<td className="p-2">{rec.servicingeDevice}</td>
								<td className="p-2 text-right">
									{rec.billAmount} Tk
								</td>
								<td className="p-2">
									<button
										className="mr-2 bg-blue-600 px-2 py-1 rounded"
										onClick={() =>
											router.push(`/service/${rec._id}`)
										}>
										View
									</button>
									<button
										className="mr-2 bg-indigo-600 px-2 py-1 rounded"
										onClick={() => printRecord(rec)}>
										Print
									</button>
									<button
										className="mr-2 bg-yellow-600 px-2 py-1 rounded"
										onClick={() =>
											router.push(
												`/service/${rec._id}/edit`
											)
										}>
										Edit
									</button>
									<button
										className="bg-red-600 px-2 py-1 rounded"
										onClick={() => handleDelete(rec._id)}>
										Delete
									</button>
								</td>
							</tr>
						))}
						{list.length === 0 && (
							<tr>
								<td
									colSpan="6"
									className="p-4 text-center text-gray-400">
									No records
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
