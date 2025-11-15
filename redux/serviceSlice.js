import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchServices = createAsyncThunk(
	"service/fetchServices",
	async ({ type }) => {
		const res = await axios.get(`/api/service?type=${type}`);
		return res.data; // API response: { success, list, total, page, limit }
	}
);

export const fetchServiceStats = createAsyncThunk(
	"service/fetchStats",
	async (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		const res = await axios.get(`/api/service/stats${qs ? "?" + qs : ""}`);
		return res.data;
	}
);

export const deleteService = createAsyncThunk(
	"service/deleteService",
	async (id, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/api/service/${id}`);
			return { id, ...res.data };
		} catch (err) {
			return rejectWithValue(
				err.response?.data || { message: err.message }
			);
		}
	}
);

export const addService = createAsyncThunk(
	"service/addService",
	async (payload, { rejectWithValue }) => {
		try {
			const res = await axios.post("/api/service", payload);
			// API response: { success: true, record: {...} }
			return res.data;
		} catch (err) {
			return rejectWithValue(
				err.response?.data || { message: err.message }
			);
		}
	}
);

export const updateService = createAsyncThunk(
	"service/updateService",
	async ({ id, payload }, { rejectWithValue }) => {
		try {
			const res = await axios.put(`/api/service/${id}`, payload);
			return res.data; // backend থেকে return { success: true, record }
		} catch (err) {
			return rejectWithValue(
				err.response?.data || { message: err.message }
			);
		}
	}
);

const slice = createSlice({
	name: "service",
	initialState: {
		list: [],
		total: 0,
		current: null,
		loading: false,
		error: null,
		stats: null,
		page: 1,
		limit: 50,
	},
	reducers: {
		clearCurrent(state) {
			state.current = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch services
			.addCase(fetchServices.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(fetchServices.fulfilled, (s, a) => {
				s.loading = false;
				s.list = a.payload.list || [];
				s.total = a.payload.total || 0;
				s.page = a.payload.page || 1;
				s.limit = a.payload.limit || 50;
			})
			.addCase(fetchServices.rejected, (s, a) => {
				s.loading = false;
				s.error = a.error?.message || a.payload?.message;
			})

			// Fetch stats
			.addCase(fetchServiceStats.pending, (s) => {
				s.loading = true;
			})
			.addCase(fetchServiceStats.fulfilled, (s, a) => {
				s.loading = false;
				s.stats = a.payload;
			})
			.addCase(fetchServiceStats.rejected, (s, a) => {
				s.loading = false;
				s.error = a.payload?.message || a.error?.message;
			})

			// Delete service
			.addCase(deleteService.pending, (s) => {
				s.loading = true;
			})
			.addCase(deleteService.fulfilled, (s, a) => {
				s.loading = false;
				s.list = s.list.filter((i) => i._id !== a.payload.id);
				s.total -= 1;
			})
			.addCase(deleteService.rejected, (s, a) => {
				s.loading = false;
				s.error = a.payload?.message || a.error?.message;
			})
			.addCase(updateService.pending, (s) => {
				s.loading = true;
			})
			.addCase(updateService.fulfilled, (s, a) => {
				s.loading = false;
				if (a.payload.record) {
					s.list = s.list.map((it) =>
						it._id === a.payload.record._id ? a.payload.record : it
					);
					if (s.current && s.current._id === a.payload.record._id)
						s.current = a.payload.record;
				}
			})
			.addCase(updateService.rejected, (s, a) => {
				s.loading = false;
				s.error = a.payload?.message || a.error?.message;
			});
	},
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;
