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
        // Extract error message safely
        const message = err?.message || err?.data?.error || JSON.stringify(err);
        alert("Operation failed: " + message);
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
  <div className="min-h-screen p-6 bg-[#0D0D10] text-gray-200 max-w-6xl mx-auto">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-extrabold tracking-wide">💰 Monthly Bills</h2>
      <button
        className="bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
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
    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-800">
      <table className="w-full table-auto rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-[#1a1a22] text-gray-300 text-sm uppercase">
            <th className="p-3 border-b border-gray-800 text-left">Bill Name</th>
            <th className="p-3 border-b border-gray-800 text-left">Current Month</th>
            <th className="p-3 border-b border-gray-800 text-left">Last Month</th>
            <th className="p-3 border-b border-gray-800 w-32 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {billsWithStatus.map((bill, idx) => (
            <tr
              key={idx}
              className="hover:bg-[#1b1b25] transition-all border-b border-gray-800"
            >
              <td className="p-3 font-medium">{bill.name}</td>

              <td
                className={`p-3 font-semibold rounded ${
                  bill.current.paid
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {bill.current.paid
                  ? `✔ Paid (${bill.current.amount} Tk)`
                  : "✖ Not Paid"}
              </td>

              <td
                className={`p-3 font-semibold ${
                  bill.last.paid
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {bill.last.paid
                  ? `✔ Paid (${bill.last.amount} Tk)`
                  : "✖ Not Paid"}
              </td>

              <td className="p-3 text-center flex justify-center gap-2">
                {bill.current._id && (
                  <>
                    <button
                      onClick={() =>
                        startEdit({
                          _id: bill.current._id,
                          name: bill.name,
                          amount: bill.current.amount,
                        })
                      }
                      className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(bill.current._id)}
                      className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow"
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

    {/* Modal */}
    {openModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-[#1a1a22] p-6 rounded-xl w-96 shadow-2xl border border-gray-700">

          <h3 className="text-xl font-bold mb-4 text-gray-100">
            {editId ? "✏ Update Bill" : "➕ Add Bill"}
          </h3>

          <select
            className="bg-[#0f0f14] border border-gray-700 p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-blue-600"
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
            className="bg-[#0f0f14] border border-gray-700 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-600"
            placeholder="Amount (Tk)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setOpenModal(false);
                setEditId(null);
                setForm({ name: "", amount: "" });
              }}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={submitBill}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow"
              disabled={actionLoading}
            >
              {actionLoading ? "Saving…" : editId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);
}