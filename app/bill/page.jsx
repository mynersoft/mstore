"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills, addBill, updateBill, deleteBill } from "@/redux/billSlice";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";

export default function BillPage() {
  const dispatch = useDispatch();
  const billsState = useSelector((state) => state.bills) || {};
  const { list = [], loading = false, actionLoading = false } = billsState;

  // UI states
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", isLastMonthUpdate: false });
  const [editId, setEditId] = useState(null);

  // Month filter: default to current month
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM")); // "2025-11" format

  // Load bills once
  useEffect(() => {
    dispatch(fetchBills())
      .unwrap()
      .catch((err) => {
        console.error("fetchBills failed:", err);
        toast.error("Failed to fetch bills");
      });
  }, [dispatch]);

  // Helper: list of month options from bills (or last 12 months)
  const monthOptions = useMemo(() => {
    // Create last 12 months list
    const arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push(dayjs().subtract(i, "month").format("YYYY-MM"));
    }
    return arr;
  }, []);

  // Filtered list by selectedMonth for display / calculations
  const filteredList = useMemo(() => {
    return list.filter((b) => {
      try {
        return dayjs(b.createdAt).format("YYYY-MM") === selectedMonth;
      } catch {
        return false;
      }
    });
  }, [list, selectedMonth]);

  // build summary cards (Option B)
  const summary = useMemo(() => {
    const paidThisMonth = filteredList.filter((b) => !!b.amount).reduce((s, b) => s + Number(b.amount || 0), 0);
    // In our shape: if a bill exists for the selected month, count it as paid. For "Due" we compare expected bills names — but here we'll compute due as named bills that are missing.
    const names = ["Dukan vara", "WiFi", "Biddut (Electricity)"];
    const unpaidCount = names.reduce((cnt, name) => {
      const found = filteredList.find((b) => b.name === name);
      return cnt + (found ? 0 : 1);
    }, 0);

    const dueThisMonth = names.reduce((s, name) => {
      const found = filteredList.find((b) => b.name === name);
      return s + (found ? 0 : 0); // amount unknown for due in this system; keep as 0 unless you want to set defaults
    }, 0);

    // Last month unpaid total (sum of amounts for bills in last month that are marked unpaid - we treat missing as unpaid and cannot sum amount)
    const lastMonthStr = dayjs(selectedMonth + "-01").subtract(1, "month").format("YYYY-MM");
    const lastMonthList = list.filter((b) => dayjs(b.createdAt).format("YYYY-MM") === lastMonthStr);
    // sum amounts of bills existing last month (these are paid last month)
    const lastMonthPaid = lastMonthList.reduce((s, b) => s + Number(b.amount || 0), 0);
    // last month unpaid count (names missing)
    const lastMonthUnpaidCount = names.reduce((cnt, name) => {
      const found = lastMonthList.find((b) => b.name === name);
      return cnt + (found ? 0 : 1);
    }, 0);

    return {
      paidThisMonth,
      dueThisMonth,
      unpaidCount,
      lastMonthPaid,
      lastMonthUnpaidCount,
      totalBills: list.length,
    };
  }, [filteredList, list, selectedMonth]);

  // Compute billsWithStatus for UI rows (current/last)
  const billsWithStatus = useMemo(() => {
    const names = ["Dukan vara", "WiFi", "Biddut (Electricity)"];
    const selMonthLabel = dayjs(selectedMonth + "-01").format("MMMM YYYY");
    const lastMonthLabel = dayjs(selectedMonth + "-01").subtract(1, "month").format("MMMM YYYY");

    return names.map((name) => {
      const current = list.find(
        (b) => b.name === name && dayjs(b.createdAt).format("YYYY-MM") === selectedMonth
      );
      const last = list.find(
        (b) => b.name === name && dayjs(b.createdAt).format("YYYY-MM") === dayjs(selectedMonth + "-01").subtract(1, "month").format("YYYY-MM")
      );
      return {
        name,
        current: { paid: !!current, amount: current?.amount || 0, _id: current?._id || null },
        last: { paid: !!last, amount: last?.amount || 0, _id: last?._id || null },
        labels: { current: selMonthLabel, last: lastMonthLabel },
      };
    });
  }, [list, selectedMonth]);




const submitBill = async () => {
  if (!form.name || !form.amount) {
    toast.error("Please fill all fields");
    return;
  }

  const payload = { name: form.name, amount: Number(form.amount) };

  // 🔥 Check if current month bill already exists
  const exists = list.find(
    (b) =>
      b.name === payload.name &&
      dayjs(b.createdAt).format("MMMM YYYY") === currentMonth
  );

  if (!editId && exists) {
    toast.error("This bill is already paid for this month!");
    return;
  }

  try {
    if (editId) {
      await dispatch(updateBill({ ...payload, _id: editId })).unwrap();
      toast.success("Bill updated successfully!");
    } else {
      await dispatch(addBill(payload)).unwrap();
      toast.success("Bill added successfully!");
    }

    setForm({ name: "", amount: "" });
    setEditId(null);
    setOpenModal(false);
  } catch (err) {
    const msg = err?.message || err?.data?.error || "Operation failed";
    toast.error(msg);
  }
};







  const startEdit = (item) => {
    setEditId(item._id);
    setForm({ name: item.name, amount: item.amount, isLastMonthUpdate: false });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await dispatch(deleteBill(id)).unwrap();
      toast.success("Deleted");
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#0D0D10] text-gray-200 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide">💰 Monthly Bills</h2>
          <p className="text-sm text-gray-400 mt-1">Manage monthly bills, update last-month dues, and track summary.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#0f0f14] border border-gray-700 p-2 rounded"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {dayjs(m + "-01").format("MMMM YYYY")}
                </option>
              ))}
            </select>
          </div>

          <button
            className="bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            onClick={() => {
              setForm({ name: "", amount: "", isLastMonthUpdate: false });
              setEditId(null);
              setOpenModal(true);
            }}
          >
            + Add Bill
          </button>
        </div>
      </div>

      {/* Summary Cards (Option B) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#121217] p-4 rounded-lg shadow border border-gray-800">
          <div className="text-sm text-gray-400">🟢 Paid ({dayjs(selectedMonth + "-01").format("MMMM YYYY")})</div>
          <div className="text-2xl font-bold mt-2">{summary.paidThisMonth} Tk</div>
        </div>

        <div className="bg-[#121217] p-4 rounded-lg shadow border border-gray-800">
          <div className="text-sm text-gray-400">🔴 Due (Count)</div>
          <div className="text-2xl font-bold mt-2">{summary.unpaidCount}</div>
        </div>

        <div className="bg-[#121217] p-4 rounded-lg shadow border border-gray-800">
          <div className="text-sm text-gray-400">🟡 Last Month Paid</div>
          <div className="text-2xl font-bold mt-2">{summary.lastMonthPaid} Tk</div>
        </div>

        <div className="bg-[#121217] p-4 rounded-lg shadow border border-gray-800">
          <div className="text-sm text-gray-400">📊 Total Bills</div>
          <div className="text-2xl font-bold mt-2">{summary.totalBills}</div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-800">
        <table className="w-full table-auto rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#1a1a22] text-gray-300 text-sm uppercase">
              <th className="p-3 border-b border-gray-800 text-left">Bill Name</th>
              <th className="p-3 border-b border-gray-800 text-left">Current Month</th>
              <th className="p-3 border-b border-gray-800 text-left">Last Month</th>
              <th className="p-3 border-b border-gray-800 w-40 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {billsWithStatus.map((bill, idx) => (
              <tr key={idx} className="hover:bg-[#1b1b25] transition-all border-b border-gray-800">
                <td className="p-3 font-medium">{bill.name}</td>

                <td className={`p-3 font-semibold ${bill.current.paid ? "text-green-400" : "text-red-400"}`}>
                  {bill.current.paid ? `✔ Paid (${bill.current.amount} Tk)` : "✖ Not Paid"}
                </td>

                <td className="p-3">
                  {bill.last.paid ? (
                    <span className="text-green-400 font-semibold">✔ Paid ({bill.last.amount} Tk)</span>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-red-400 font-semibold">✖ Not Paid</span>
                      <button
                        className="bg-yellow-500 text-black px-2 py-1 rounded mt-1 hover:bg-yellow-600 w-max"
                        onClick={() => {
                          // open modal to add last month due
                          setEditId(null);
                          setForm({ name: bill.name, amount: "", isLastMonthUpdate: true });
                          setOpenModal(true);
                          // show note
                          toast("Update last month's due for " + bill.name, { icon: "🕒" });
                        }}
                      >
                        Update Due
                      </button>
                    </div>
                  )}
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
            <h3 className="text-xl font-bold mb-4 text-gray-100">{editId ? "✏ Update Bill" : form.isLastMonthUpdate ? "🕒 Add Last Month Due" : "➕ Add Bill"}</h3>

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

            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isLastMonthUpdate}
                  onChange={(e) => setForm({ ...form, isLastMonthUpdate: e.target.checked })}
                  className="accent-yellow-400"
                />{" "}
                Save as last month due
              </label>

              <div className="text-sm text-gray-400">
                Saving for: <span className="font-medium text-gray-200">{dayjs(selectedMonth + "-01").format("MMMM YYYY")}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenModal(false);
                  setEditId(null);
                  setForm({ name: "", amount: "", isLastMonthUpdate: false });
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