"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import ProductTable from "@/components/ProductTable";
import SalesChart from "@/components/SalesChart";
import { useDispatch, useSelector } from "react-redux";
import { getTopProducts, getStockOutProducts } from "@/lib/dashboardUtils";
import DashboardStats from "@/components/DashboardStats";

export default function DashboardPage() {
	const products = useSelector((state) => state?.products?.items || []);
	const dues = useSelector((state) => state?.dues?.items || []);
	const { daily, monthly, breakdown, loading } = useSelector(
		(state) => state.saleprofit
	);
	const { totalAmount } = useSelector((state) => state.products);

	const [topProducts, setTopProducts] = useState([]);
	const [stockOut, setStockOut] = useState([]);
	const [totalDue, setTotalDue] = useState(0);
	const [totalAmountProducts, setTotalAmountProducts] = useState(0);

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
		<div className="p-6 space-y-6">
			{/* Header */}

			{/* Stat Cards */}
			<div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-gray-200">
				<StatCard
					title="Daily Sale"
					value={`${daily.totalSale || 0} tk`}
					color="red"
					className="bg-gray-900"
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

			{/* Chart */}
			<div className="bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4">
					Sales & Profit Chart
				</h2>
				<SalesChart data={salesData} />
			</div>

			{/* Top Products */}
			<div className="bg-gray-900 rounded-2xl shadow p-6">
				<h2 className="text-xl font-semibold mb-4">🏆 Top Products</h2>
				{topProducts.length ? (
					<ProductTable products={topProducts} showActions={false} />
				) : (
					<p className="text-gray-400">No top products found.</p>
				)}
			</div>

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
