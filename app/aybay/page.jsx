"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAyBay, addAyBay } from "@/redux/aybaySlice";
import toast from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch();
  const aybay = useSelector((state) => state.aybay.list);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  useEffect(() => {
    dispatch(fetchAyBay()).unwrap().catch(() => {
      toast.error("ডাটা লোড হয়নি");
    });
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!title || !amount) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    try {
      await dispatch(addAyBay({ title, amount, type })).unwrap();
      toast.success("সফলভাবে যোগ হয়েছে");
      setTitle("");
      setAmount("");
      setType("income");
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  const income = aybay
    .filter((i) => i.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = aybay
    .filter((i) => i.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center">
          💰 আয় ব্যয় হিসাব
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded-xl">
            <p className="text-sm">মোট আয়</p>
            <p className="text-xl font-bold text-green-600">{income} ৳</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-sm">মোট ব্যয়</p>
            <p className="text-xl font-bold text-red-600">{expense} ৳</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl">
            <p className="text-sm">ব্যালেন্স</p>
            <p className="text-xl font-bold text-blue-600">
              {income - expense} ৳
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">আয়</option>
            <option value="expense">ব্যয়</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            Add
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow divide-y">
          {aybay.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              কোন ডাটা নেই
            </p>
          )}

          {aybay.map((item) => (
            <div
              key={item._id}
              className="flex justify-between p-3 items-center"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
              <p
                className={`font-bold ${
                  item.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.amount} ৳
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}