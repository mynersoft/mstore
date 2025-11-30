"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills, addBill, updateBill, deleteBill } from "@/redux/billSlice";
import dayjs from "dayjs";

export default function BillPage() {
    const dispatch = useDispatch();
    const { list, loading, actionLoading } = useSelector((state) => state.bills);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", amount: "" });
    const [editId, setEditId] = useState(null);

    const currentMonth = dayjs().format("MMMM YYYY");

    // Fetch bills on mount
    useEffect(() => {
        dispatch(fetchBills());
    }, [dispatch]);

    // Compute paid/unpaid status for current month
    const paymentsThisMonth = useMemo(() => {
        const names = ["Dukan vara", "WiFi", "Biddut (Electricity)"];
        return names.map((name) => {
            const found = list.find(
                (i) => i.name === name && dayjs(i.createdAt).format("MMMM YYYY") === currentMonth
            );
            return {
                name,
                amount: found?.amount || 0,
                paid: !!found,
                _id: found?._id || null,
            };
        });
    }, [list, currentMonth]);

    // Submit Add/Edit
    const submit = async () => {
        if (!form.name || !form.amount) {
            alert("Please fill all fields");
            return;
        }

        try {
            const payload = {
                name: form.name,
                amount: Number(form.amount),
            };

            if (editId) {
                await dispatch(updateBill({ ...payload, _id: editId })).unwrap();
            } else {
                await dispatch(addBill(payload)).unwrap();
            }

            // Reset form
            setForm({ name: "", amount: "" });
            setEditId(null);
            setOpen(false);
        } catch (err) {
            alert("Operation failed: " + err);
        }
    };

    // Start editing a bill
    const startEdit = (item) => {
        setEditId(item._id);
        setForm({ name: item.name, amount: item.amount });
        setOpen(true);
    };

    // Delete bill
    const handleDelete = async (id) => {
        if (!confirm("Delete this bill?")) return;
        try {
            await dispatch(deleteBill(id)).unwrap();
        } catch (err) {
            alert("Delete failed: " + err);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-950 text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Bills & Investments</h2>

            {/* Current Month Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {paymentsThisMonth.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-lg shadow-lg ${
                            item.paid ? "bg-green-700" : "bg-red-700"
                        }`}
                    >
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p>Status: {item.paid ? "✅ Paid" : "❌ Not Paid"}</p>
                        <p className="mt-1">Amount: {item.amount} Tk</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => startEdit(item)}
                                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            {item._id && (
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">
                            {editId ? "Edit Bill" : "Add Bill"}
                        </h3>

                        <input
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                            placeholder="Amount"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setEditId(null);
                                    setForm({ name: "", amount: "" });
                                }}
                                className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? "Saving..."
                                    : editId
                                    ? "Update"
                                    : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}