// redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch products
export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async ({ page = 1, limit = 10 } = {}) => {
		const res = await axios.get(
			`/api/products`
		);
		// If your API returns { products: [...] }, extract it
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
		items: [], // make sure this is an array
		loading: false,
		error: null,
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
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Add Product
			.addCase(addProduct.fulfilled, (state, action) => {
				if (!Array.isArray(state.items)) state.items = [];
				state.items.unshift(action.payload); // add to beginning
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
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export default productSlice.reducer;
