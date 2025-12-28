import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAyBay = createAsyncThunk(
  "aybay/fetch",
  async () => {
    const res = await fetch("/api/aybay");
    const json = await res.json();
    return json.data; // ✅ array
  }
);

export const addAyBay = createAsyncThunk(
  "aybay/add",
  async (data) => {
    const res = await fetch("/api/aybay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data; // ✅ single object
  }
);

const aybaySlice = createSlice({
  name: "aybay",
  initialState: {
    list: [], // ✅ always array
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAyBay.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addAyBay.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default aybaySlice.reducer;