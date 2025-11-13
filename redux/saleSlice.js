// redux/sellSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSale = createAsyncThunk("sale/fetch", async () => {
	const res = await axios.get("/api/sale");
	return res.data;
});

export const addSale = createAsyncThunk("sale/add", async (payload) => {
	const res = await axios.post("/api/sale", payload);
	return res.data;
});

const saleSlice = createSlice({
	name: "sale",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSale.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchSale.fulfilled, (state, action) => {
				state.loading = false;
				state.items = Array.isArray(action.payload)
					? action.payload
					: [];
			})
			.addCase(fetchSale.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message || "Fetch failed";
			})

			.addCase(addSale.fulfilled, (state, action) => {
				state.items.unshift(action.payload);
			})
			.addCase(addSale.rejected, (state, action) => {
				state.error = action.error?.message || "Save failed";
			});
	},
});

export default saleSlice.reducer;
