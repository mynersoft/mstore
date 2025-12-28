"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAyBay,
  addAyBay,
  updateAyBay,
  deleteAyBay,
} from "@/redux/aybaySlice";
import toast from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch();
  const aybay = useSelector((state) => state.aybay.list || []);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const [editItem, setEditItem] = useState(null);

  // fetch data
  useEffect(() => {
    dispatch(fetchAyBay()).unwrap().catch(() => {
      toast.error("ডাটা লোড হয়নি");
    });
  }, [dispatch]);

  // add
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

  // update
  const handleUpdate = async () => {
    if (!editItem.title || !editItem.amount) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    try {
      await dispatch(
        updateAyBay({
          id: editItem._id,
          data: {
            title: editItem.title,
            amount: editItem.amount,
            type: editItem.type,
          },
        })
      ).unwrap();

      toast.success("Update সফল হয়েছে");
      setEditItem(null);
    } catch {
      toast.error("Update হয়নি");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;

    try {
      await dispatch(deleteAyBay(id)).unwrap();
      toast.success("ডিলিট হয়েছে");
    } catch {
      toast.error("ডিলিট হয়নি");
    }
  };

  // calculations
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
            <p className="text-xl font-bold text-green-600">
              {income} ৳
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-sm">মোট ব্যয়</p>
            <p className="text-xl font-bold text-red-600">
              {expense} ৳
            </p>
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
            className="w-full bg-black text-white py-2 rounded"
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
              className="flex justify-between items-center p-3"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.type}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-bold ${
                    item.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.amount} ৳
                </span>

                <button
                  onClick={() => setEditItem(item)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-80 space-y-3">
            <h3 className="font-bold text-center">
              Edit আয় / ব্যয়
            </h3>

            <input
              className="border p-2 w-full rounded"
              value={editItem.title}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  title: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="border p-2 w-full rounded"
              value={editItem.amount}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  amount: e.target.value,
                })
              }
            />

            <select
              className="border p-2 w-full rounded"
              value={editItem.type}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  type: e.target.value,
                })
              }
            >
              <option value="income">আয়</option>
              <option value="expense">ব্যয়</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setEditItem(null)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-black text-white px-4 py-1 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}