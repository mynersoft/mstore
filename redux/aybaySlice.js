import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// fetch আয়-ব্যয়
export const fetchAyBay = createAsyncThunk(
  "aybay/fetch",
  async () => {
    const res = await fetch("/api/aybay");
    return res.json();
  }
);

// add আয়-ব্যয়
export const addAyBay = createAsyncThunk(
  "aybay/add",
  async (data) => {
    const res = await fetch("/api/aybay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
);

const aybaySlice = createSlice({
  name: "aybay",
  initialState: {
    list: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAyBay.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addAyBay.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default aybaySlice.reducer;