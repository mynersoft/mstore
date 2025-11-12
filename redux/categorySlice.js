import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
	"categories/fetchCategories",
	async () => {
		const res = await axios.get("/api/categories");
		return res.data;
	}
);

// Add category
export const addCategory = createAsyncThunk(
	"categories/addCategory",
	async (payload) => {
		const res = await axios.post("/api/categories", payload, {
			headers: { "Content-Type": "application/json" },
		});
		return res.data;
	}
);

// Update category
export const updateCategory = createAsyncThunk(
	"categories/updateCategory",
	async ({ id, ...payload }) => {
		const res = await axios.put(
			"/api/categories",
			{ id, ...payload },
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		return res.data;
	}
);

// Delete category
export const deleteCategory = createAsyncThunk(
	"categories/deleteCategory",
	async (id) => {
		await axios.delete("/api/categories", {
			data: { id },
			headers: { "Content-Type": "application/json" },
		});
		return id;
	}
);

const categorySlice = createSlice({
	name: "categories",
	initialState: {
		list: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// fetchCategories
			.addCase(fetchCategories.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.list = action.payload;
				state.loading = false;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// addCategory
			.addCase(addCategory.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})

			// updateCategory
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.list = state.list.map((cat) =>
					cat._id === action.payload._id ? action.payload : cat
				);
			})

			// deleteCategory
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.list = state.list.filter(
					(cat) => cat._id !== action.payload
				);
			});
	},
});

export default categorySlice.reducer;
