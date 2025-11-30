"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills, addBill, updateBill, deleteBill } from "@/redux/billSlice";
import dayjs from "dayjs";

export default function BillPage() {
  const dispatch = useDispatch();
  const billsState = useSelector((state) => state.bills) || {};
  const { list = [], loading = false, actionLoading = false } = billsState;

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "" });
  const [editId, setEditId] = useState(null);

  const currentMonth = dayjs().format("MMMM YYYY");
  const lastMonth = dayjs().subtract(1, "month").format("MMMM YYYY");

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  // Compute bill status for current and last month
  const billsWithStatus = useMemo(() => {
    const names = ["Dukan vara", "WiFi", "Biddut (Electricity)"];
    return names.map((name) => {
      const current = list.find(
        (b) => b.name === name && dayjs(b.createdAt).format("MMMM YYYY") === currentMonth
      );
      const last = list.find(
        (b) => b.name === name && dayjs(b.createdAt).format("MMMM YYYY") === lastMonth
      );
      return {
        name,
        current: { paid: !!current, amount: current?.amount || 0, _id: current?._id || null },
        last: { paid: !!last, amount: last?.amount || 0, _id: last?._id || null },
      };
    });
  }, [list, currentMonth, lastMonth]);

  // Add / Edit bill
  const submitBill = async () => {
    if (!form.name || !form.amount) return alert("Please fill all fields");
    const payload = { name: form.name, amount: Number(form.amount) };

    try {
      if (editId) {
        await dispatch(updateBill({ ...payload, _id: editId })).unwrap();
      } else {
        await dispatch(addBill(payload)).unwrap();
      }
      setForm({ name: "", amount: "" });
      setEditId(null);
      setOpenModal(false);
    } catch (err) {
      alert("Operation failed: " + err);
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({ name: item.name, amount: item.amount });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await dispatch(deleteBill(id)).unwrap();
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-950 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Bills & Investments</h2>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setForm({ name: "", amount: "" });
            setEditId(null);
            setOpenModal(true);
          }}
        >
          + Add Bill
        </button>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-3 border border-gray-700">Name</th>
              <th className="p-3 border border-gray-700">Current Month</th>
              <th className="p-3 border border-gray-700">Last Month</th>
              <th className="p-3 border border-gray-700 w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {billsWithStatus.map((bill, idx) => (
              <tr key={idx} className="hover:bg-gray-800">
                <td className="p-3 border border-gray-700">{bill.name}</td>
                <td className={`p-3 border border-gray-700 ${bill.current.paid ? "bg-green-700" : "bg-red-700"}`}>
                  {bill.current.paid ? `✅ Paid (${bill.current.amount} Tk)` : "❌ Not Paid"}
                </td>
                <td className={`p-3 border border-gray-700 ${bill.last.paid ? "bg-green-700" : "bg-red-700"}`}>
                  {bill.last.paid ? `✅ Paid (${bill.last.amount} Tk)` : "❌ Not Paid"}
                </td>
                <td className="p-3 border border-gray-700 flex gap-2">
                  {bill.current._id && (
                    <>
                      <button
                        onClick={() => startEdit({ _id: bill.current._id, name: bill.name, amount: bill.current.amount })}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.current._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Bill Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4">{editId ? "Edit Bill" : "Add Bill"}</h3>

            <select
              className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            >
              <option value="">Select Bill</option>
              <option value="Dukan vara">Dukan vara</option>
              <option value="WiFi">WiFi</option>
              <option value="Biddut (Electricity)">Biddut (Electricity)</option>
            </select>

            <input
              type="number"
              className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setOpenModal(false); setEditId(null); setForm({ name: "", amount: "" }); }}
                className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={submitBill}
                className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}