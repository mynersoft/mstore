import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch products
export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async ({ page = 1, limit = 10 } = {}) => {
		const res = await axios.get(`/api/products`);
		return Array.isArray(res.data) ? res.data : res.data.products || [];
	}
);

// Add product
export const addProduct = createAsyncThunk(
	"products/addProduct",
	async (payload) => {
		const res = await axios.post("/api/products", payload);
		return res.data;
	}
);

// Update product
export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async (payload) => {
		const res = await axios.put("/api/products", payload);
		return res.data;
	}
);

// Delete product
export const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (id) => {
		await axios.delete(`/api/products?id=${id}`);
		return id;
	}
);

const productSlice = createSlice({
	name: "products",
	initialState: {
		items: [],
		loading: false,
		error: null,
		totalAmount: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch Products
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.items = Array.isArray(action.payload)
					? action.payload
					: [];
				state.loading = false;

				// ✅ Calculate total amount
				state.totalAmount = state.items.reduce(
					(sum, p) => sum + (p.stock || 0) * (p.regularPrice || 0),
					0
				);
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Add Product
			.addCase(addProduct.fulfilled, (state, action) => {
				if (!Array.isArray(state.items)) state.items = [];
				state.items.unshift(action.payload);

				// ✅ Update total
				state.totalAmount +=
					(action.payload.stock || 0) *
					(action.payload.regularPrice || 0);
			})
			.addCase(addProduct.rejected, (state, action) => {
				state.error = action.error.message;
			})

			// Update Product
			.addCase(updateProduct.fulfilled, (state, action) => {
				if (!Array.isArray(state.items)) state.items = [];

				state.items = state.items.map((item) =>
					item._id === action.payload._id ? action.payload : item
				);

				// ✅ Recalculate total after update
				state.totalAmount = state.items.reduce(
					(sum, p) => sum + (p.stock || 0) * (p.regularPrice || 0),
					0
				);
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.error = action.error.message;
			})

			// Delete Product
			.addCase(deleteProduct.fulfilled, (state, action) => {
				if (!Array.isArray(state.items)) state.items = [];

				state.items = state.items.filter(
					(item) => item._id !== action.payload
				);

				// ✅ Recalculate total after delete
				state.totalAmount = state.items.reduce(
					(sum, p) => sum + (p.stock || 0) * (p.regularPrice || 0),
					0
				);
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export default productSlice.reducer;
