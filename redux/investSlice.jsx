import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch All
export const fetchInvests = createAsyncThunk("invest/fetch", async () => {
  const res = await fetch("/api/invest");
  return res.json();
});

// Add New
export const addInvest = createAsyncThunk("invest/add", async (data) => {
  const res = await fetch("/api/invest", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
});

// Update
export const updateInvest = createAsyncThunk("invest/update", async (data) => {
  const res = await fetch("/api/invest", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
});

// Delete
export const deleteInvest = createAsyncThunk("invest/delete", async (id) => {
  const res = await fetch("/api/invest", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return { id };
});

const investSlice = createSlice({
  name: "invest",
  initialState: {
    list: [],
    loading: false,
    filterType: "all",
  },
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvests.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addInvest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateInvest.fulfilled, (state, action) => {
        const index = state.list.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteInvest.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload.id);
      });
  },
});

export const { setFilterType } = investSlice.actions;
export default investSlice.reducer;