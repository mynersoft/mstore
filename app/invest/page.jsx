"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addInvest,
  fetchInvests,
  deleteInvest,
  updateInvest,
  setFilterType,
} from "@/redux/investSlice";

export default function InvestPage() {
  const dispatch = useDispatch();
  const { list, filterType } = useSelector((state) => state.invest);

  const [form, setForm] = useState({
    name: "",
    investType: "",
    amount: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchInvests());
  }, []);

  const submit = () => {
    if (!form.name || !form.investType || !form.amount) return;

    if (editId) {
      dispatch(updateInvest({ ...form, _id: editId }));
      setEditId(null);
    } else {
      dispatch(addInvest(form));
    }

    setForm({ name: "", investType: "", amount: "" });
  };

  const filteredList =
    filterType === "all"
      ? list
      : list.filter((i) => i.investType === filterType);

  const totalAmount = filteredList.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      investType: item.investType,
      amount: item.amount,
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        {editId ? "Edit Investment" : "Add Investment"}
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        value={form.investType}
        onChange={(e) => setForm({ ...form, investType: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="dukaner-malamal">Dukaner Malamal</option>
        <option value="tools">Tools</option>
        <option value="cash">Cash</option>
      </select>

      <input
        type="number"
        className="border p-2 w-full mb-3"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {editId ? "Update" : "Add"}
      </button>

      <h3 className="text-xl font-semibold mt-6">Filter</h3>

      <select
        className="border p-2 w-full mb-4"
        value={filterType}
        onChange={(e) => dispatch(setFilterType(e.target.value))}
      >
        <option value="all">All</option>
        <option value="dukaner-malamal">Dukaner Malamal</option>
        <option value="tools">Tools</option>
        <option value="cash">Cash</option>
      </select>

      <h3 className="text-xl font-semibold">Total: {totalAmount} Tk</h3>

      <div className="mt-4 space-y-3">
        {filteredList.map((item) => (
          <div key={item._id} className="border p-3 rounded bg-gray-50">
            <p><b>{item.name}</b></p>
            <p>Type: {item.investType}</p>
            <p>Amount: {item.amount}</p>

            <div className="flex gap-3 mt-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => dispatch(deleteInvest(item._id))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}