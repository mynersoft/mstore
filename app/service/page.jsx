"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDues } from "@/redux/duesSlice";
import DueFormModal from "@/components/DueFormModal";

export default function DuePage() {
  const dispatch = useDispatch();
  const dues = useSelector((s) => s.dues.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [currentDue, setCurrentDue] = useState(null);

  useEffect(() => {
    dispatch(fetchDues());
  }, [dispatch]);

  const handleEdit = (item) => {
    setMode("edit");
    setCurrentDue(item);
    setModalOpen(true);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Customer Dues</h1>

      <table className="w-full mt-5 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d) => (
            <tr key={d._id}>
              <td className="border p-2">{d.customer}</td>
              <td className="border p-2">{d.amount}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(d)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <DueFormModal
        open={modalOpen}
        mode={mode}
        currentDue={currentDue}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}