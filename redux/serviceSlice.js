// redux/serviceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchServices = createAsyncThunk(
	"service/fetchServices",
	async (params = {}) => {
		// params: { page, limit, date }
		const qs = new URLSearchParams(params).toString();
		const res = await axios.get(`/api/service${qs ? "?" + qs : ""}`);
		return res.data;
	}
);

export const fetchService = createAsyncThunk(
	"service/fetchService",
	async (id) => {
		const res = await axios.get(`/api/service/${id}`);
		return res.data;
	}
);

export const addService = createAsyncThunk(
	"service/addService",
	async (payload, { rejectWithValue }) => {
		try {
			const res = await axios.post("/api/service", payload);
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
			return res.data;
		} catch (err) {
			return rejectWithValue(
				err.response?.data || { message: err.message }
			);
		}
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

export const fetchServiceStats = createAsyncThunk(
	"service/fetchStats",
	async (params = {}) => {
		// params: { type: 'daily'|'monthly'|'monthlyBreakdown', date, year, month }
		const qs = new URLSearchParams(params).toString();
		const res = await axios.get(`/api/service/stats${qs ? "?" + qs : ""}`);
		return res.data;
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
	},
	reducers: {
		clearCurrent(state) {
			state.current = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchServices.pending, (s) => {
				s.loading = true;
				s.error = null;
			})
			.addCase(fetchServices.fulfilled, (s, a) => {
				s.loading = false;
				s.list = a.payload.records || [];
				s.total = a.payload.total || 0;
			})
			.addCase(fetchServices.rejected, (s, a) => {
				s.loading = false;
				s.error = a.error?.message || a.payload?.message;
			})

			.addCase(fetchService.pending, (s) => {
				s.loading = true;
			})
			.addCase(fetchService.fulfilled, (s, a) => {
				s.loading = false;
				s.current = a.payload.record || null;
			})
			.addCase(fetchService.rejected, (s, a) => {
				s.loading = false;
				s.error = a.error?.message || a.payload?.message;
			})

			.addCase(addService.pending, (s) => {
				s.loading = true;
			})
			.addCase(addService.fulfilled, (s, a) => {
				s.loading = false;
				if (a.payload.record) s.list.unshift(a.payload.record);
			})
			.addCase(addService.rejected, (s, a) => {
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
			})

			.addCase(deleteService.pending, (s) => {
				s.loading = true;
			})
			.addCase(deleteService.fulfilled, (s, a) => {
				s.loading = false;
				s.list = s.list.filter((i) => i._id !== a.payload.id);
			})
			.addCase(deleteService.rejected, (s, a) => {
				s.loading = false;
				s.error = a.payload?.message || a.error?.message;
			})

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
			});
	},
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;
