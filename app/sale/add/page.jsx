"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSale, fetchSale } from "@/redux/saleSlice";
import { generateInvoiceNumber } from "@/lib/generateInvoice";

export default function SellPage() {
	const dispatch = useDispatch();
	const products = useSelector((state) => state?.products?.items || []);

	const [customer, setCustomer] = useState({
		name: "",
		phone: "",
	});
	const [itemMemo, setItemsMemo] = useState([
		{
			name: "",
			qty: 1,
			invoice: "",
			price: 0,
			total: 0,
		},
	]);
	const [discount, setDiscount] = useState(0);
	const [total, setTotal] = useState(0);
	const [date, setDate] = useState("");

	const [invoiceNo, setInvoiceNo] = useState(null);

	useEffect(() => {
		dispatch(fetchSale());
		setDate(new Date().toLocaleDateString());
	}, [dispatch]);

	// update total whenever itemMemo or discount changes
	useEffect(() => {
		const subtotal = itemMemo.reduce(
			(sum, it) => sum + it.qty * it.price,
			0
		);
		const totalAmount = subtotal - discount;
		setTotal(totalAmount); // <-- update total state
	}, [itemMemo, discount]);

	const handleChange = (index, field, value) => {
		const newItems = [...itemMemo];
		newItems[index][field] =
			field === "qty" || field === "price" ? +value : value;

		// auto-fill price if product selected
		if (field === "name") {
			const prod = products.find((p) => p.name === value);
			if (prod) newItems[index].price = prod.price;
		}

		newItems[index].total = newItems[index].qty * newItems[index].price;
		setItemsMemo(newItems);
	};

	const handleAddItem = () =>
		setItemsMemo([...itemMemo, { name: "", qty: 1, price: 0, total: 0 }]);
	const handleRemoveItem = (idx) =>
		setItemsMemo(itemMemo.filter((_, i) => i !== idx));

	// handle save

// Update total when items or discount change
useEffect(() => {
	const subtotal = itemMemo.reduce((sum, it) => sum + it.qty * it.price, 0);
	const totalAmount = subtotal - discount;
	setTotal(totalAmount);
}, [itemMemo, discount]);

	const handleSave = async () => {
		const subtotal = itemMemo.reduce(
			(sum, it) => sum + it.qty * it.price,
			0
		);
		const saleData = {
			customer,
			items: itemMemo,
			discount,
			subtotal,
			total: subtotal - discount,
			invoice: invoiceNo,
			date,
		};

		try {
			await dispatch(addSale(saleData)); // or use .unwrap() if supported
			alert("✅ Sale saved successfully!");
			setCustomer({ name: "", phone: "" });
			setItemsMemo([{ name: "", qty: 1, price: 0, total: 0 }]);
			setDiscount(0);
			setTotal(0);
			setInvoiceNo(generateInvoiceNumber()); // next sale
		} catch (err) {
			alert("Failed to save sale: " + err.message);
		}
	};

	useEffect(() => {
		setInvoiceNo(generateInvoiceNumber());
	});

	const handlePrint = () => {
		const content = document.getElementById("memo").innerHTML;
		const w = window.open("", "", "width=900,height=700");
		w.document.write(`
			<html>
				<head>
					<title>Memo</title>
					<style>
						body { font-family: Arial; padding: 20px; color: #000; }
						table { width: 100%; border-collapse: collapse; margin-top: 10px; }
						th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
						th { background: #f0f0f0; }
						.text-right { text-align: right; }
					</style>
				</head>
				<body>${content}</body>
			</html>
		`);
		w.document.close();
		w.print();
	};

	return (
		<>
			{/* Sale entry  */}
			<div className="min-h-screen bg-gray-950 text-gray-100 p-8">
				<div className="max-w-5xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-700">
					<h1 className="text-2xl font-bold text-center mb-6">
						🧾 Sell Entry — Bismillah Telecom & Servicing
					</h1>

					{/* Customer Info Form */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						<input
							type="text"
							placeholder="Customer Name"
							value={customer.name}
							onChange={(e) =>
								setCustomer({
									...customer,
									name: e.target.value,
								})
							}
							className="bg-gray-800 p-2 rounded border border-gray-700"
						/>
						<input
							type="text"
							placeholder="Phone Number"
							value={customer.phone}
							onChange={(e) =>
								setCustomer({
									...customer,
									phone: e.target.value,
								})
							}
							className="bg-gray-800 p-2 rounded border border-gray-700"
						/>
					</div>

					{/* Product Table */}
					<div id="memo">
						<div className="mb-4">
							<div className="flex justify-between mb-4">
								<div>
									<div className="font-semibold text-lg">
										Bismillah Telecom & Servicing
									</div>
									<div>
										Address: Aushnara, Madhupur, Tangail
									</div>
									<div>Mobile: 01868944080</div>
									<div>Date: {date}</div>
								</div>
								<div className="text-right">
									<div>Customer:</div>
									<div className="font-semibold">
										{customer.name || "N/A"}
									</div>
									<div>Phone: {customer.phone || "N/A"}</div>
									<div>Invoice: {invoiceNo} </div>
								</div>
							</div>

							<table className="w-full text-sm border border-gray-700 mb-3">
								<thead className="bg-gray-800">
									<tr>
										<th>#</th>
										<th>Item Name</th>
										<th>Qty</th>
										<th>Price</th>
										<th>Total</th>
										<th>Remove</th>
									</tr>
								</thead>
								<tbody>
									{itemMemo.map((it, idx) => (
										<tr key={idx}>
											<td className="border border-gray-700">
												{idx + 1}
											</td>

											{/* Dropdown + Manual Input */}
											<td className="border border-gray-700">
												<input
													list={`products-list-${idx}`}
													value={it.name}
													onChange={(e) =>
														handleChange(
															idx,
															"name",
															e.target.value
														)
													}
													placeholder="Product Name or type manually"
													className="w-full bg-gray-900 p-1 rounded border border-gray-700"
												/>
												<datalist
													id={`products-list-${idx}`}>
													{products.map((p, i) => (
														<option
															key={i}
															value={p.name}
														/>
													))}
												</datalist>
											</td>

											<td className="border border-gray-700 text-center">
												<input
													type="number"
													min="1"
													value={it.qty}
													onChange={(e) =>
														handleChange(
															idx,
															"qty",
															e.target.value
														)
													}
													className="w-16 bg-gray-900 p-1 rounded border border-gray-700 text-center"
												/>
											</td>
											<td className="border border-gray-700 text-right">
												<input
													type="number"
													min="0"
													value={it.price}
													onChange={(e) =>
														handleChange(
															idx,
															"price",
															e.target.value
														)
													}
													className="w-24 bg-gray-900 p-1 rounded border border-gray-700 text-right"
												/>
											</td>
											<td className="border border-gray-700 text-right">
												{it.total}
											</td>
											<td className="border border-gray-700 text-center">
												<button
													type="button"
													onClick={() =>
														handleRemoveItem(idx)
													}
													className="text-red-500 hover:text-red-400">
													✖
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="flex justify-between mb-3">
								<button
									type="button"
									onClick={handleAddItem}
									className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
									➕ Add Item
								</button>

								<div>
									<label className="mr-2">Discount: </label>
									<input
										type="number"
										value={discount}
										onChange={(e) =>
											setDiscount(+e.target.value)
										}
										className="bg-gray-800 border border-gray-700 p-1 rounded w-28 text-right"
									/>
								</div>
							</div>

							<div className="text-right text-lg font-semibold border-t border-gray-700 pt-2">
								Total: {total} Tk
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex gap-4 justify-center mt-4">
						<button
							type="button"
							onClick={handleSave}
							className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold">
							💾 Save
						</button>
						<button
							type="button"
							onClick={handlePrint}
							className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded font-semibold">
							🖨️ Print
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
