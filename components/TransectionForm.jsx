import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction  } from " @/redux/transactionsSlice";

export default function AddTransactionForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", amount: "", type: "ay" });

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(addTransaction(form));
    setForm({ name: "", amount: "", type: "ay" });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="ay">Ay (Income)</option>
        <option value="invest">Invest</option>
      </select>

      <button>Add</button>
    </form>
  );
}