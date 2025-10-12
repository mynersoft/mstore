"use client";

import { useEffect, useState } from "react";

export default function DuesPage() {
  const [dues, setDues] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    dueAmount: "",
  });

  // Fetch dues
  const fetchDues = async () => {
    const res = await fetch("/api/dues");
    const data = await res.json();
    setDues(data);
  };

  useEffect(() => {
    fetchDues();
  }, []);

  // Add new due
  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch("/api/dues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ customerName: "", phone: "", dueAmount: "" });
    fetchDues();
  };

  // Mark as paid (partial or full)
  const handlePay = async (id, amount) => {
    await fetch("/api/dues", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount }),
    });
    fetchDues();
  };

  // Delete record
  const handleDelete = async (id) => {
    await fetch(`/api/dues?id=${id}`, { method: "DELETE" });
    fetchDues();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">💰 Customer Due Management</h1>

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
              <tr
                key={d._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="p-3">{d.customerName}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3 text-yellow-400">৳{d.dueAmount}</td>
                <td className="p-3 text-green-400">৳{d.paid}</td>
                <td className="p-3">
                  {d.lastPaymentDate
                    ? new Date(d.lastPaymentDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      handlePay(d._id, prompt("Enter payment amount:", "0"))
                    }
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
    </div>
  );
}