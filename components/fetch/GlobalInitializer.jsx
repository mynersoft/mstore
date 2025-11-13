"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";
import { fetchDues } from "@/redux/duesSlice";

export function GlobalInitializer() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchProducts());
		dispatch(fetchDues());
	}, [dispatch]);
	return null;
}
