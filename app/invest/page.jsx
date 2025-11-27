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

  const [open, setOpen] = useState(false);

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
    } else {
      dispatch(addInvest(form));
    }

    setForm({ name: "", investType: "", amount: "" });
    setEditId(null);
    setOpen(false);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      investType: item.investType,
      amount: item.amount,
    });
    setOpen(true);
  };

  const filteredList =
    filterType === "all"
      ? list
      : list.filter((i) => i.investType === filterType);

  const totalAmount = filteredList.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Investments</h2>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Invest
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-4 items-center mb-4">
          <select
            className="bg-gray-800 border border-gray-700 p-2 rounded"
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value))}
          >
            <option value="all">All</option>
            <option value="dukaner-malamal">Dukaner Malamal</option>
            <option value="tools">Tools</option>
            <option value="cash">Cash</option>
          </select>

          <p className="text-lg">
            <b>Total:</b> {totalAmount} Tk
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg border border-gray-700 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3 border-b border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-700">Type</th>
                <th className="p-3 border-b border-gray-700">Amount</th>
                <th className="p-3 border-b border-gray-700 w-40">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-800 transition border-b border-gray-800"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 capitalize">{item.investType}</td>
                  <td className="p-3">{item.amount}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteInvest(item._id))}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-400" colSpan={4}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-4">
                {editId ? "Edit Investment" : "Add Investment"}
              </h3>

              <input
                className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <select
                className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3"
                value={form.investType}
                onChange={(e) =>
                  setForm({ ...form, investType: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="dukaner-malamal">Dukaner Malamal</option>
                <option value="tools">Tools</option>
                <option value="cash">Cash</option>
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
                    setForm({ name: "", investType: "", amount: "" });
                  }}
                  className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={submit}
                  className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}