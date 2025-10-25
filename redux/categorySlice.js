import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  const res = await fetch("/api/categories");
  return await res.json();
});

const categorySlice = createSlice({
  name: "categories",
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default categorySlice.reducer;