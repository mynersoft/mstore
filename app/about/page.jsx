"use client";


import { useState } from "react";
import ReusableModal from "@/components/modal/ReusableModal";

export default function TestPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Open Modal
      </button>

      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add New Category"
        footer={
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => {
              alert("Saved!");
              setOpen(false);
            }}
          >
            Save
          </button>
        }
      >
        <div>
          <label className="block mb-2 font-medium">Category Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter category"
          />
        </div>
      </ReusableModal>
    </div>
  );
}