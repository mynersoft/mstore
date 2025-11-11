import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
	"products/fetch",
	async ({ page = 1, limit = 10 }) => {
		const res = await axios.get(
			`/api/products?page=${page}&limit=${limit}`
		);
		return res.data;
	}
);


export const addProduct = createAsyncThunk("products/add", async (product) => {
  const res = await axios.post("/api/products", product);
  return res.data;
});

export const updateProduct = createAsyncThunk("products/update", async (product) => {
  const res = await axios.put("/api/products", product);
  return res.data;
});

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await axios.delete(`/api/products?id=${id}`);
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], total: 0, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default productSlice.reducer;