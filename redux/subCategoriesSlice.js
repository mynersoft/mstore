import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchsubCategories = createAsyncThunk("subCategories/fetch", async () => {
  const res = await fetch("/api/subCategories");
  return await res.json();
});

const subCategorySlice = createSlice({
  name: "subcategories",
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchsubCategories.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default subCategorySlice.reducer;