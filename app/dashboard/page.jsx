"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import ProductTable from "@/components/ProductTable";
import SalesChart from "@/components/SalesChart";
import { useSelector } from "react-redux";
import { getTopProducts, getStockOutProducts } from "@/lib/dashboardUtils";

export default function DashboardPage() {
	const products = useSelector((state) => state?.products?.items);
	const [dailySell, setDailySell] = useState(0);
	const [monthlySell, setMonthlySell] = useState(0);
	const [dailyProfit, setDailyProfit] = useState(0);
	const [monthlyProfit, setMonthlyProfit] = useState(0);
	const [topProducts, setTopProducts] = useState([]);
	const [stockOut, setStockOut] = useState([]);

	// Dummy sales data (you can replace with API data)
	const [salesData, setSalesData] = useState([
		{ date: "2025-10-01", sales: 300, profit: 100 },
		{ date: "2025-10-02", sales: 450, profit: 150 },
		{ date: "2025-10-03", sales: 500, profit: 200 },
		{ date: "2025-10-04", sales: 200, profit: 80 },
	]);

	useEffect(() => {
		// Calculate total sales and profit
		const totalSell = salesData.reduce((sum, s) => sum + s.sales, 0);
		const totalProfit = salesData.reduce((sum, s) => sum + s.profit, 0);

		setDailySell(salesData[salesData.length - 1].sales);
		setDailyProfit(salesData[salesData.length - 1].profit);
		setMonthlySell(totalSell);
		setMonthlyProfit(totalProfit);

		// Top and stock-out products
		setTopProducts(getTopProducts(products));
		setStockOut(getStockOutProducts(products));
	}, [salesData, products]);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Daily Sell"
					value={`৳${dailySell}`}
					color="blue"
				/>
				<StatCard
					title="Daily Profit"
					value={`৳${dailyProfit}`}
					color="green"
				/>
				<StatCard
					title="Monthly Sell"
					value={`৳${monthlySell}`}
					color="purple"
				/>
				<StatCard
					title="Monthly Profit"
					value={`৳${monthlyProfit}`}
					color="orange"
				/>
			</div>

			{/* Chart Section */}
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4">
					Sales & Profit Chart
				</h2>
				<SalesChart data={salesData} />
			</div>

			{/* Top Products */}
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4">🏆 Top Products</h2>
				{topProducts.length ? (
					<ProductTable products={topProducts} showActions={false} />
				) : (
					<p className="text-gray-500">No top products found.</p>
				)}
			</div>

			{/* Stock Out Notice */}
			<div className="bg-red-50 dark:bg-red-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4 text-red-600">
					⚠️ Stock Out Products
				</h2>
				{stockOut.length ? (
					<ProductTable products={stockOut} showActions={false} />
				) : (
					<p className="text-gray-500">No stock-out products 🎉</p>
				)}
			</div>
		</div>
	);
}
