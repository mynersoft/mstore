"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
        addInvest,
        fetchInvests,
        deleteInvest,
        updateInvest,
        setFilterType,
} from "@/redux/investSlice";
import dayjs from "dayjs";

export default function InvestPage() {
        const dispatch = useDispatch();
        const [open, setOpen] = useState(false);

        const { list, loading, actionLoading, filterType } = useSelector(
                (state) => state.invest
        );

        const [form, setForm] = useState({
                name: "",
                investType: "",
                amount: "",
        });
        const [editId, setEditId] = useState(null);

        // Fetch investments on mount
        useEffect(() => {
                dispatch(fetchInvests());
        }, [dispatch]);

        // Filter items safely
        const filterItems = useMemo(() => {
                if (!Array.isArray(list)) return [];
                const validList = list.filter(Boolean);
                if (filterType === "all") return validList;
                return validList.filter((i) => i.investType === filterType);
        }, [filterType, list]);

        // Total amount calculation
        const totalAmount = useMemo(() => {
                return filterItems.reduce((acc, curr) => {
                        if (!curr || !curr.amount) return acc;
                        return acc + Number(curr.amount);
                }, 0);
        }, [filterItems]);




        
// Current month
const currentMonth = dayjs().format("MMMM YYYY");

// Payments for this month
const paymentsThisMonth = useMemo(() => {
    const names = ["Dukan vara", "Wifi", "Biddut"];
    return names.map((name) => {
        // Find any investment with this name in the current month
        const found = list.find(
            (i) => i.name === name && dayjs(i.createdAt).format("MMMM YYYY") === currentMonth
        );
        return {
            name,
            amount: found ? found.amount : 0,
            paid: !!found,
        };
    });
}, [list, currentMonth]);






        // Submit form (add or update)
        const submit = async () => {
                if (!form.name || !form.investType || !form.amount) {
                        alert("Please fill all fields");
                        return;
                }

                const payload = {
                        name: form.name,
                        investType: form.investType,
                        amount: Number(form.amount),
                };

                try {
                        if (editId) {
                                await dispatch(
                                        updateInvest({ ...payload, _id: editId })
                                ).unwrap();
                        } else {
                                await dispatch(addInvest(payload)).unwrap();
                        }

                        setForm({ name: "", investType: "", amount: "" });
                        setEditId(null);
                        setOpen(false);
                } catch (err) {
                        alert("Operation failed: " + err);
                }
        };

        const startEdit = (item) => {
                if (!item) return;
                setEditId(item._id);
                setForm({
                        name: item.name || "",
                        investType: item.investType || "",
                        amount: item.amount?.toString() || "",
                });
                setOpen(true);
        };

        const handleDelete = async (id) => {
                if (!confirm("Delete this invest?")) return;
                try {
                        await dispatch(deleteInvest(id)).unwrap();
                        alert("Deleted successfully!");
                } catch (err) {
                        alert("Delete failed: " + err);
                }
        };

        return (
                <div className="min-h-screen bg-[#0f172a] text-white p-6">
                        <div className="max-w-5xl mx-auto">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-3xl font-bold">Investments</h2>
                                        <button
                                                onClick={() => {
                                                        setEditId(null);
                                                        setForm({ name: "", investType: "", amount: "" });
                                                        setOpen(true);
                                                }}
                                                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                                                + Add Invest
                                        </button>
                                </div>

                                {/* Current Month Payments */}
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        {/* Dukan Vara */}
                                        <div
                                                className={`p-4 rounded-lg shadow-lg ${
                                                        currentMonthInvests[0]?.paidThisMonth
                                                                ? "bg-green-700"
                                                                : "bg-red-700"
                                                }`}>
                                                <h3 className="font-bold text-lg">Dukan Vara</h3>
                                                <p>
                                                        Status:{" "}
                                                        {currentMonthInvests[0]?.paidThisMonth
                                                                ? "✅ Paid"
                                                                : "❌ Not Paid"}
                                                </p>
                                                <p className="mt-1">
                                                        Amount: {currentMonthInvests[0]?.amount || 0} Tk
                                                </p>
                                        </div>

                                        {/* WiFi */}
                                        {bills.map((bill, idx) => (
                                                <div
                                                        key={idx}
                                                        className={`p-4 rounded-lg shadow-lg ${
                                                                bill.paid ? "bg-green-700" : "bg-red-700"
                                                        }`}>
                                                        <h3 className="font-bold text-lg">{bill.name}</h3>
                                                        <p>Status: {bill.paid ? "✅ Paid" : "❌ Not Paid"}</p>
                                                        <p className="mt-1">Amount: {bill.amount} Tk</p>
                                                </div>
                                        ))}
                                </div>

                                {/* Filter */}
                                <div className="flex gap-4 items-center mb-4">
                                        <select
                                                className="bg-gray-800 border border-gray-700 p-2 rounded"
                                                value={filterType}
                                                onChange={(e) =>
                                                        dispatch(setFilterType(e.target.value))
                                                }>
                                                <option value="all">All</option>
                                                <option value="malamal">Malamal</option>
                                                <option value="tools">Tools</option>
                                                <option value="others">Others</option>
                                        </select>

                                        <p className="text-lg">
                                                <b>Total:</b> {totalAmount} Tk
                                        </p>
                                </div>

                                {/* Table or Loader */}
                                {loading ? (
                                        <div className="space-y-3">
                                                {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                                key={i}
                                                                className="bg-gray-800 animate-pulse h-14 rounded"></div>
                                                ))}
                                        </div>
                                ) : (
                                        <div className="overflow-x-auto shadow-lg border border-gray-700 rounded-lg">
                                                <table className="w-full text-left border-collapse">
                                                        <thead className="bg-gray-800 text-gray-300">
                                                                <tr>
                                                                        <th className="p-3 border-b border-gray-700">
                                                                                Name
                                                                        </th>
                                                                        <th className="p-3 border-b border-gray-700">
                                                                                Type
                                                                        </th>
                                                                        <th className="p-3 border-b border-gray-700">
                                                                                Amount
                                                                        </th>
                                                                        <th className="p-3 border-b border-gray-700 w-40">
                                                                                Action
                                                                        </th>
                                                                </tr>
                                                        </thead>

                                                        <tbody>
                                                                {filterItems.length > 0 ? (
                                                                        filterItems.map((item) =>
                                                                                item ? (
                                                                                        <tr
                                                                                                key={item._id}
                                                                                                className="hover:bg-gray-800 transition border-b border-gray-800">
                                                                                                <td className="p-3">
                                                                                                        {item.name}
                                                                                                </td>
                                                                                                <td className="p-3 capitalize">
                                                                                                        {item.investType}
                                                                                                </td>
                                                                                                <td className="p-3">
                                                                                                        {item.amount}
                                                                                                </td>
                                                                                                <td className="p-3 flex gap-2">
                                                                                                        <button
                                                                                                                onClick={() =>
                                                                                                                        startEdit(item)
                                                                                                                }
                                                                                                                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                                                                                                                disabled={
                                                                                                                        actionLoading
                                                                                                                }>
                                                                                                                {actionLoading &&
                                                                                                                editId === item._id
                                                                                                                        ? "..."
                                                                                                                        : "Edit"}
                                                                                                        </button>
                                                                                                        <button
                                                                                                                onClick={() =>
                                                                                                                        handleDelete(
                                                                                                                                item._id
                                                                                                                        )
                                                                                                                }
                                                                                                                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                                                                                                                disabled={
                                                                                                                        actionLoading
                                                                                                                }>
                                                                                                                {actionLoading
                                                                                                                        ? "Deleting..."
                                                                                                                        : "Delete"}
                                                                                                        </button>
                                                                                                </td>
                                                                                        </tr>
                                                                                ) : null
                                                                        )
                                                                ) : (
                                                                        <tr>
                                                                                <td
                                                                                        className="p-4 text-center text-gray-400"
                                                                                        colSpan={4}>
                                                                                        No data found
                                                                                </td>
                                                                        </tr>
                                                                )}
                                                        </tbody>
                                                </table>
                                        </div>
                                )}

                                {/* Modal */}
                                {open && (
                                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                                                <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-xl border border-gray-700">
                                                        <h3 className="text-xl font-bold mb-4">
                                                                {editId ? "Edit Investment" : "Add Investment"}
                                                        </h3>

                                                        <input
                                                                className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                                                                placeholder="Name"
                                                                value={form.name}
                                                                onChange={(e) =>
                                                                        setForm({ ...form, name: e.target.value })
                                                                }
                                                        />

                                                        <select
                                                                className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                                                                value={form.investType}
                                                                onChange={(e) =>
                                                                        setForm({
                                                                                ...form,
                                                                                investType: e.target.value,
                                                                        })
                                                                }>
                                                                <option value="">Select Type</option>
                                                                <option value="malamal">Malamal</option>
                                                                <option value="tools">Tools</option>
                                                                <option value="others">Others</option>
                                                        </select>

                                                        <input
                                                                type="number"
                                                                className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-4"
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
                                                                                setForm({
                                                                                        name: "",
                                                                                        investType: "",
                                                                                        amount: "",
                                                                                });
                                                                        }}
                                                                        className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
                                                                        disabled={actionLoading}>
                                                                        Cancel
                                                                </button>

                                                                <button
                                                                        onClick={submit}
                                                                        className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                                                        disabled={actionLoading}>
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
                </div>
        );
}