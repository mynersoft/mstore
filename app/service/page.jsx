"use client";

import { useEffect, useState } from "react";

/**
 * Service Records Page
 * - List all records
 * - Add new record (modal)
 * - Edit record (modal)
 * - Delete record
 */

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg w-full max-w-2xl p-6">
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deviceName: "",
    billAmount: "",
    warranty: { hasWarranty: false, warrantyMonths: 0 },
    notes: "",
    receivedAt: "",
    status: "received",
  });

  // fetch all records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/service-records");
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      customerName: "",
      phone: "",
      deviceName: "",
      billAmount: "",
      warranty: { hasWarranty: false, warrantyMonths: 0 },
      notes: "",
      receivedAt: "",
      status: "received",
    });
    setIsModalOpen(true);
  };

  const openEdit = (rec) => {
    setEditing(rec);
    setForm({
      customerName: rec.customerName || "",
      phone: rec.phone || "",
      deviceName: rec.deviceName || "",
      billAmount: rec.billAmount || 0,
      warranty: rec.warranty || { hasWarranty: false, warrantyMonths: 0 },
      notes: rec.notes || "",
      receivedAt: rec.receivedAt ? new Date(rec.receivedAt).toISOString().slice(0,10) : "",
      status: rec.status || "received",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.customerName || !form.phone || !form.deviceName) {
      alert("Customer name, phone and device name are required");
      return;
    }

    const payload = {
      ...form,
      billAmount: Number(form.billAmount) || 0,
      warranty: {
        hasWarranty: !!form.warranty.hasWarranty,
        warrantyMonths: Number(form.warranty.warrantyMonths) || 0,
      },
    };

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/service-records/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/service-records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err?.error || res.statusText));
        return;
      }

      await fetchRecords();
      setIsModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      const res = await fetch(`/api/service-records/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err?.error || res.statusText));
        return;
      }
      await fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-gray-700 dark:text-gray-300">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📱 Service Records</h1>
        <div>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            + Add Record
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Device</th>
                  <th className="p-2">Bill (৳)</th>
                  <th className="p-2">Warranty</th>
                  <th className="p-2">Received</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 align-top">{i + 1}</td>
                    <td className="p-2 align-top">{r.customerName}</td>
                    <td className="p-2 align-top">{r.phone}</td>
                    <td className="p-2 align-top">{r.deviceName}</td>
                    <td className="p-2 align-top">৳{r.billAmount}</td>
                    <td className="p-2 align-top">
                      {r.warranty?.hasWarranty ? `${r.warranty?.warrantyMonths} mo` : "No"}
                    </td>
                    <td className="p-2 align-top">
                      {r.receivedAt ? new Date(r.receivedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-2 align-top">{r.status}</td>
                    <td className="p-2 align-top text-center space-x-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Record" : "Add New Record"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Customer Name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
            <input
              type="text"
              placeholder="Device Name / Model"
              value={form.deviceName}
              onChange={(e) => setForm({ ...form, deviceName: e.target.value })}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Bill Amount"
              value={form.billAmount}
              onChange={(e) => setForm({ ...form, billAmount: e.target.value })}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.warranty.hasWarranty}
                  onChange={(e) =>
                    setForm({ ...form, warranty: { ...form.warranty, hasWarranty: e.target.checked } })
                  }
                />
                Warranty
              </label>
              <input
                type="number"
                min="0"
                placeholder="Warranty months"
                value={form.warranty.warrantyMonths}
                onChange={(e) =>
                  setForm({ ...form, warranty: { ...form.warranty, warrantyMonths: e.target.value } })
                }
                className="p-2 rounded bg-gray-100 dark:bg-gray-800"
                style={{ width: 140 }}
                disabled={!form.warranty.hasWarranty}
              />
            </div>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="p-2 rounded bg-gray-100 dark:bg-gray-800"
            >
              <option value="received">Received</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="delivered">Delivered</option>
            </select>

            <input
              type="date"
              value={form.receivedAt}
              onChange={(e) => setForm({ ...form, receivedAt: e.target.value })}
              className="p-2 rounded bg-gray-100 dark:bg-gray-800"
            />
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          />

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {editing ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditing(null); }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}