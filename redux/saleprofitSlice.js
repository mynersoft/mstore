import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDailyStats = createAsyncThunk(
	"saleprofit/fetchDaily",
	async (date) => {
		const url = date
			? `/api/saleprofit?type=daily&date=${date}`
			: `/api/saleprofit?type=daily`;
		const res = await axios.get(url);
		return res.data;
	}
);

export const fetchMonthlyStats = createAsyncThunk(
	"saleprofit/fetchMonthly",
	async ({ year, month } = {}) => {
		const params = [];
		if (year) params.push(`year=${year}`);
		if (month) params.push(`month=${month}`);
		const query = params.length ? `&${params.join("&")}` : "";
		const res = await axios.get(`/api/saleprofit?type=monthly${query}`);
		return res.data;
	}
);

export const fetchMonthlyBreakdown = createAsyncThunk(
	"saleprofit/fetchMonthlyBreakdown",
	async ({ year, month } = {}) => {
		const params = [];
		if (year) params.push(`year=${year}`);
		if (month) params.push(`month=${month}`);
		const query = params.length ? `&${params.join("&")}` : "";
		const res = await axios.get(`/api/saleprofit?type=monthlyBreakdown${query}`);
		return res.data;
	}
);

const saleprofitSlice = createSlice({
	name: "saleprofit",
	initialState: {
		loading: false,
		daily: { totalSale: 0, totalProfit: 0, totalQty: 0, date: null },
		monthly: {
			totalSale: 0,
			totalProfit: 0,
			totalQty: 0,
			year: null,
			month: null,
		},
		breakdown: { year: null, month: null, data: [] },
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action) =>
					action.type.startsWith("saleprofit/") &&
					action.type.endsWith("/pending"),
				(state) => {
					state.loading = true;
					state.error = null;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("saleprofit/") &&
					action.type.endsWith("/fulfilled"),
				(state, action) => {
					state.loading = false;
					const payload = action.payload;
					if (!payload) return;
					if (payload.type === "daily") {
						state.daily = {
							totalSale: payload.totalSale || 0,
							totalProfit: payload.totalProfit || 0,
							totalQty: payload.totalQty || 0,
							date: payload.date,
						};
					} else if (payload.type === "monthly") {
						state.monthly = {
							totalSale: payload.totalSale || 0,
							totalProfit: payload.totalProfit || 0,
							totalQty: payload.totalQty || 0,
							year: payload.year,
							month: payload.month,
						};
					} else if (payload.breakdown) {
						state.breakdown = {
							year: payload.year,
							month: payload.month,
							data: payload.breakdown,
						};
					}
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("saleprofit/") &&
					action.type.endsWith("/rejected"),
				(state, action) => {
					state.loading = false;
					state.error = action.error.message;
				}
			);
	},
});

export default saleprofitSlice.reducer;
