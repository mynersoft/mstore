"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import StatCard from "@/components/StatCard";
import ProductTable from "@/components/ProductTable";
import SalesChart from "@/components/SalesChart";
import { useDispatch, useSelector } from "react-redux";
import { getTopProducts, getStockOutProducts } from "@/lib/dashboardUtils";
import DailySaleProfit from "@/components/chart/DailySaleProfit";
import axios from "axios";

export default function DashboardPage() {
	const bestSelling = useSelector((state) => state.products.bestSelling);
	const products = useSelector((state) => state?.products?.items || []);
	const dues = useSelector((state) => state?.dues?.items || []);
	const { daily, monthly, breakdown, loading } = useSelector(
		(state) => state.saleprofit
	);
	const { totalAmount } = useSelector((state) => state.products);
	const [tableData, setTableData] = useState([]);
	const [monthData, setMonthData] = useState([]);

	const [topProducts, setTopProducts] = useState([]);
	const [stockOut, setStockOut] = useState([]);
	const [totalDue, setTotalDue] = useState(0);
	const [totalAmountProducts, setTotalAmountProducts] = useState(0);

	// useEffect(() => {
	// 	loadMonthly();
	// }, []);

	// const loadMonthly = async () => {
	// 	const res = await axios.get(
	// 		"/api/service/stats?type=monthly&year=2025&month=1"
	// 	);
	// 	const formatted = buildMonthlyTable(res.data.list, 2025, 1);
	// 	setTableData(formatted);
	// 	setMonthData(formatted);
	// };

	const [salesData] = useState([
		{ date: "2025-10-01", sales: 300, profit: 100 },
		{ date: "2025-10-02", sales: 450, profit: 150 },
		{ date: "2025-10-03", sales: 500, profit: 200 },
		{ date: "2025-10-04", sales: 200, profit: 80 },
	]);

	useEffect(() => {
		setTopProducts(getTopProducts(products));
		setStockOut(getStockOutProducts(products));

		const dueSum = Array.isArray(dues)
			? dues.reduce((sum, d) => sum + Number(d.amount || 0), 0)
			: 0;

		setTotalDue(dueSum);
		setTotalAmountProducts(totalAmount);
	}, [salesData, products, dues, totalAmount]);

	return (
		<div className="p-6 space-y-6 bg-gray-800">
			{/* Header */}

			{/* Stat Cards */}
			<div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-gray-200">
				<StatCard
					title="Daily Sale"
					value={`${daily.totalSale || 0} tk`}
					color="red"
				/>
				<StatCard
					title="Daily Profit"
					value={`${daily.totalProfit || 0} tk`}
					color="red"
				/>

				<StatCard
					title="Monthly Sale"
					value={`${monthly.totalSale || 0} tk`}
					color="red"
				/>
				<StatCard
					title="Monthly Profit"
					value={`${monthly.totalProfit || 0} tk`}
					color="red"
				/>

				<StatCard
					title="Total Due"
					value={`${totalDue} tk`}
					color="red"
				/>
				<StatCard
					title="Total Amount of Products"
					value={`${totalAmountProducts} tk`}
					color="green"
				/>
			</div>

			{/* best selling products  */}
			{bestSelling?.soldCount > 0 && (
				<div className="p-4 bg-gray-800 rounded-lg text-white">
					<h2 className="text-xl font-bold mb-3">
						🔥 Best Selling Product
					</h2>

					<table className="w-full border border-gray-700 text-left">
						<thead>
							<tr className="bg-gray-700">
								<th className="p-2 border border-gray-600">
									Image
								</th>
								<th className="p-2 border border-gray-600">
									Name
								</th>
								<th className="p-2 border border-gray-600">
									Brand
								</th>
								<th className="p-2 border border-gray-600">
									Sold
								</th>
							</tr>
						</thead>

						<tbody>
							<tr>
								<td className="p-2 border border-gray-700">
									{ bestSelling.image ? (
								<Image
										src={bestSelling.image}
										alt={bestSelling.name}
										width={60}
										height={60}
										className="rounded object-cover"
									/>	
								): "N/A"}
								</td>
								<td className="p-2 border border-gray-700">
									{bestSelling.name}
								</td>
								<td className="p-2 border border-gray-700">
									{bestSelling.brand}
								</td>
								<td className="p-2 border border-gray-700 text-green-400 font-bold">
									{bestSelling.soldCount} pcs
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}

			{/* Stock Out */}
			<div className="bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4 text-red-400">
					⚠️ Stock Out Products
				</h2>
				{stockOut.length ? (
					<ProductTable products={stockOut} showActions={false} />
				) : (
					<p className="text-gray-400">No stock-out products 🎉</p>
				)}
			</div>
		</div>
	);
}
