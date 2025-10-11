"use client";

import React, { useState, useEffect } from "react";

export default function DuePage() {
  const [dues, setDues] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: "",
    note: "",
    status: "due",
  });

  // Fetch dues
  useEffect(() => {
    fetch("/api/dues")
      .then((res) => res.json())
      .then(setDues);
  }, []);

  // Add new due
  const addDue = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/dues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newDue = await res.json();
    setDues([newDue, ...dues]);
    setForm({ name: "", phone: "", amount: "", note: "", status: "due" });
  };

  // Delete
  const deleteDue = async (id) => {
    await fetch(`/api/dues/${id}`, { method: "DELETE" });
    setDues(dues.filter((d) => d._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 বাকি হিসাব</h1>

      {/* Add Form */}
      <form
        onSubmit={addDue}
        className="bg-white shadow p-4 rounded-lg mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="নাম"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="মোবাইল"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="বাকির টাকা"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="due">বাকি</option>
            <option value="paid">পরিশোধ</option>
          </select>
        </div>
        <textarea
          placeholder="নোট"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          যোগ করুন
        </button>
      </form>

      {/* Due List */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">সকল বাকি হিসাব</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">নাম</th>
              <th className="p-2 border">ফোন</th>
              <th className="p-2 border">টাকা</th>
              <th className="p-2 border">স্ট্যাটাস</th>
              <th className="p-2 border">তারিখ</th>
              <th className="p-2 border">একশন</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((d) => (
              <tr key={d._id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{d.name}</td>
                <td className="p-2 border">{d.phone}</td>
                <td className="p-2 border">৳{d.amount}</td>
                <td
                  className={`p-2 border font-semibold ${
                    d.status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {d.status === "paid" ? "পরিশোধ" : "বাকি"}
                </td>
                <td className="p-2 border">
                  {new Date(d.date).toLocaleDateString("bn-BD")}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteDue(d._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    মুছুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}