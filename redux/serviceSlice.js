import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Fetch service records from API
export const fetchServices = createAsyncThunk("service/fetch", async () => {
	const res = await fetch("/api/service-records");
	const data = await res.json();
	return data;
});

const serviceSlice = createSlice({
	name: "service",
	initialState: {
		records: [],
		loading: false,
		error: null,
	},
	reducers: {
		addService(state, action) {
			state.records.push(action.payload);
		},
		updateService(state, action) {
			const index = state.records.findIndex(
				(r) => r._id === action.payload._id
			);
			if (index !== -1) state.records[index] = action.payload;
		},
		deleteService(state, action) {
			state.records = state.records.filter(
				(r) => r._id !== action.payload
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchServices.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.records = action.payload;
				state.loading = false;
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { addService, updateService, deleteService } =
	serviceSlice.actions;
export default serviceSlice.reducer;
