"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDues, addDue, payDue, deleteDue } from "@/redux/dueSlice";

export default function DuesPage() {
  const dispatch = useDispatch();
  const { items: dues, loading } = useSelector((state) => state.dues);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    dueAmount: "",
  });

  useEffect(() => {
    dispatch(fetchDues());
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.dueAmount) return;

    // Dispatch addDue and wait
    const result = await dispatch(addDue({
      customerName: form.customerName,
      phone: form.phone,
      dueAmount: Number(form.dueAmount)
    }));

    // Check if succeeded
    if (addDue.fulfilled.match(result)) {
      setForm({ customerName: "", phone: "", dueAmount: "" });
    } else {
      alert("Failed to add due. Try again.");
    }
  };

  const handlePay = async (id) => {
    const amount = prompt("Enter payment amount:", "0");
    if (amount && !isNaN(amount)) {
      await dispatch(payDue({ id, amount: Number(amount) }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this due record?")) await dispatch(deleteDue(id));
  };

  const totalDue = dues.reduce((sum, d) => sum + d.dueAmount, 0);
  const totalPaid = dues.reduce((sum, d) => sum + (d.paid || 0), 0);

  return (
    <div className="p-6 text-gray-600 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-4">💰 Customer Due Management</h1>

      {/* Total Overview */}
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 flex justify-between">
        <p>Total Due: <span className="text-yellow-400">৳{totalDue}</span></p>
        <p>Total Paid: <span className="text-green-400">৳{totalPaid}</span></p>
      </div>

      {/* Add Due Form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-3 bg-gray-800 p-4 rounded-lg mb-6"
      >
        <input
          type="text"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white flex-1"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white flex-1"
          required
        />
        <input
          type="number"
          placeholder="Due Amount"
          value={form.dueAmount}
          onChange={(e) => setForm({ ...form, dueAmount: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white flex-1"
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
        >
          ➕ Add
        </button>
      </form>

      {/* Dues Table */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Last Payment</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dues.map((d) => (
                <tr key={d._id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{d.customerName}</td>
                  <td className="p-3">{d.phone}</td>
                  <td className="p-3 text-yellow-400">৳{d.dueAmount}</td>
                  <td className="p-3 text-green-400">৳{d.paid || 0}</td>
                  <td className="p-3">
                    {d.lastPaymentDate
                      ? new Date(d.lastPaymentDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handlePay(d._id)}
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
                    >
                      💸 Pay
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!dues.length && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-400">
                    No due records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}