import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
	name: "product",
	initialState: {
		products: [],
		loading: false,

		editingProduct: null,
	},
	reducers: {
		setProducts(state, action) {
			state.products = action.payload;
		},
		addProduct(state, action) {
			state.products.push(action.payload);
		},
		updateProduct(state, action) {
			const idx = state.products.findIndex(
				(p) => p._id === action.payload._id
			);
			if (idx !== -1) state.products[idx] = action.payload;
		},
		deleteProduct(state, action) {
			state.products = state.products.filter(
				(p) => p._id !== action.payload
			);
		},
		setEditingProduct: (state, action) => {
			state.editingProduct = action.payload;
		},
	},
});

export const { setProducts, addProduct, updateProduct,setEditingProduct , deleteProduct } =
	productSlice.actions;
export default productSlice.reducer;
