import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/dues";

// Fetch all dues
export const fetchDues = createAsyncThunk("dues/fetch", async () => {
	const res = await fetch(API_URL);
	return res.json();
});

// Add new due
export const addDue = createAsyncThunk("dues/add", async (due) => {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(due),
	});
	return res.json();
});

// Pay due
export const payDue = createAsyncThunk("dues/pay", async ({ id, amount }) => {
	const res = await fetch(`${API_URL}/${id}/pay`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ amount }),
	});
	return res.json();
});

// Delete due
export const deleteDue = createAsyncThunk("dues/delete", async (id) => {
	await fetch(`${API_URL}/${id}`, { method: "DELETE" });
	return id;
});

const dueSlice = createSlice({
	name: "dues",
	initialState: { items: [], loading: false },
	extraReducers: (builder) => {
		builder
			.addCase(fetchDues.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchDues.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchDues.rejected, (state) => {
				state.loading = false;
			})

			.addCase(addDue.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})

			.addCase(payDue.fulfilled, (state, action) => {
				const idx = state.items.findIndex(
					(d) => d._id === action.payload._id
				);
				if (idx >= 0) state.items[idx] = action.payload;
			})

			.addCase(deleteDue.fulfilled, (state, action) => {
				state.items = state.items.filter(
					(d) => d._id !== action.payload
				);
			});
	},
});

export default dueSlice.reducer;
