"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBestSelling, fetchProducts } from "@/redux/productSlice";
import { fetchDues } from "@/redux/duesSlice";
import { fetchCategories } from "@/redux/categorySlice";

import { fetchServices } from "@/redux/serviceSlice";

import {
	fetchDailyStats,
	fetchMonthlyBreakdown,
	fetchMonthlyStats,
} from "@/redux/saleprofitSlice";

export function GlobalInitializer({ year, month }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchProducts());
		dispatch(fetchCategories());
		dispatch(fetchDues());
		dispatch(fetchDailyStats());
		dispatch(fetchMonthlyStats({ year, month }));
		dispatch(fetchMonthlyBreakdown({ year, month }));
		dispatch(fetchBestSelling());
		dispatch(fetchServices());
		
	}, [dispatch]);
	return null;
}
