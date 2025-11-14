"use client";
import { useEffect } from "react";
import { fetchSingleSale } from "@/redux/saleSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

export default function SaleInvoice() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { singleSale, loading } = useSelector((state) => state.sales);

	useEffect(() => {
		dispatch(fetchSingleSale(id));
	}, [id]);
	

	if (loading || !singleSale)
		return <div className="p-5 text-center">Loading...</div>;

	return (
		<div className="max-w-4xl mx-auto bg-gray-950 text-gray-100 p-10 rounded-lg mt-10 shadow-lg">
			{/* Header Section */}
			<div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-6">
				{/* Left Side */}
				<div>
					<h1 className="text-lg font-semibold text-white">
						Bismillah Telecom & Servicing
					</h1>
					<p className="text-sm text-gray-300">
						Address: Aushnara, Madhupur, Tangail
					</p>
					<p className="text-sm text-gray-300">Mobile: 01868944080</p>
					<p className="text-sm text-gray-300">
						Date:{" "}
						{new Date(singleSale.date).toLocaleDateString("en-US")}
					</p>
				</div>

				{/* Right Side */}
				<div className="text-right text-sm">
					<p>
						<span className="text-gray-400">Customer:</span>{" "}
						<span className="font-semibold">
							{singleSale.customer?.name || "N/A"}
						</span>
					</p>
					<p>
						<span className="text-gray-400">Phone:</span>{" "}
						{singleSale.customer?.phone || "N/A"}
					</p>
					<p>
						<span className="text-gray-400">Invoice:</span>{" "}
						<span className="font-mono text-gray-100">
							{singleSale.invoice}
						</span>
					</p>
				</div>
			</div>

			{/* Table */}
			<table className="w-full border border-gray-700 border-collapse mb-6 text-sm">
				<thead className="bg-gray-800 text-gray-200">
					<tr>
						<th className="border border-gray-700 p-2">Item</th>
						<th className="border border-gray-700 p-2">Qty</th>
						<th className="border border-gray-700 p-2">Price</th>
						<th className="border border-gray-700 p-2">Total</th>
					</tr>
				</thead>
				<tbody>
					{singleSale.items?.map((item, idx) => (
						<tr
							key={idx}
							className="hover:bg-gray-900 transition-colors">
							<td className="border border-gray-800 p-2">
								{item.name}
							</td>
							<td className="border border-gray-800 p-2 text-center">
								{item.qty}
							</td>
							<td className="border border-gray-800 p-2 text-right">
								{item.price}
							</td>
							<td className="border border-gray-800 p-2 text-right">
								{item.total}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Totals */}
			<div className="text-right text-sm space-y-1">
				<p>Subtotal: {singleSale.subtotal} Tk</p>
				<p>Discount: {singleSale.discount} Tk</p>
				<p className="text-lg font-semibold text-white">
					Total: {singleSale.total} Tk
				</p>
			</div>

			{/* Print Button */}
			<div className="text-center mt-8">
				<button
					onClick={() => window.print()}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">
					🖨️ Print PDF
				</button>
			</div>
		</div>
	);
}
