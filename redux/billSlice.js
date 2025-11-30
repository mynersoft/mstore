import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all bills
export const fetchBills = createAsyncThunk("bills/fetch", async () => {
    const res = await fetch("/api/bills");
    return res.json();
});

export const addBill = createAsyncThunk("bills/addBill", async (bill) => {
    const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
    });
    if (!res.ok) {
        const data = await res.json();
        throw data; // This will be caught in catch(err)
    }
    return res.json();
});

// Update bill
export const updateBill = createAsyncThunk("bills/update", async (payload) => {
    const res = await fetch("/api/bills", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
    });
    return res.json();
});

// Delete bill
export const deleteBill = createAsyncThunk("bills/delete", async (_id) => {
    const res = await fetch("/api/bills", {
        method: "DELETE",
        body: JSON.stringify({ _id }),
        headers: { "Content-Type": "application/json" },
    });
    return _id;
});

const billSlice = createSlice({
    name: "bills",
    initialState: { list: [], loading: false, actionLoading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBills.pending, (state) => { state.loading = true; })
            .addCase(fetchBills.fulfilled, (state, action) => {
                state.list = action.payload; state.loading = false;
            })
            .addCase(fetchBills.rejected, (state) => { state.loading = false; })

            .addCase(addBill.pending, (state) => { state.actionLoading = true; })
            .addCase(addBill.fulfilled, (state, action) => {
                state.list.unshift(action.payload); state.actionLoading = false;
            })
            .addCase(addBill.rejected, (state) => { state.actionLoading = false; })

            .addCase(updateBill.pending, (state) => { state.actionLoading = true; })
            .addCase(updateBill.fulfilled, (state, action) => {
                const idx = state.list.findIndex(b => b._id === action.payload._id);
                if(idx !== -1) state.list[idx] = action.payload;
                state.actionLoading = false;
            })
            .addCase(updateBill.rejected, (state) => { state.actionLoading = false; })

            .addCase(deleteBill.pending, (state) => { state.actionLoading = true; })
            .addCase(deleteBill.fulfilled, (state, action) => {
                state.list = state.list.filter(b => b._id !== action.payload);
                state.actionLoading = false;
            })
            .addCase(deleteBill.rejected, (state) => { state.actionLoading = false; });
    },
});

export default billSlice.reducer;