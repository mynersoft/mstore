import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Fetch dues
export const fetchDues = createAsyncThunk("dues/fetchDues", async () => {
  const res = await fetch("/api/dues");
  return await res.json();
});

// ✅ Add new due
export const addDue = createAsyncThunk("dues/addDue", async (due) => {
  const res = await fetch("/api/dues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(due),
  });
  return await res.json();
});

// ✅ Update due (payment)
export const payDue = createAsyncThunk("dues/payDue", async ({ id, amount }) => {
  const res = await fetch("/api/dues", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, amount }),
  });
  return await res.json();
});

// ✅ Delete due
export const deleteDue = createAsyncThunk("dues/deleteDue", async (id) => {
  await fetch(`/api/dues?id=${id}`, { method: "DELETE" });
  return id;
});

const dueSlice = createSlice({
  name: "dues",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addDue.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(payDue.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteDue.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d._id !== action.payload);
      });
  },
});

export default dueSlice.reducer;