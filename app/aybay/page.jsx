"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAyBay, addAyBay } from "@/redux/slices/aybaySlice";

export default function Home() {
  const dispatch = useDispatch();
  const aybay = useSelector((state) => state.aybay.list);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  useEffect(() => {
    dispatch(fetchAyBay());
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(addAyBay({ title, amount, type }));
    setTitle("");
    setAmount("");
  };

  const income = aybay
    .filter((i) => i.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = aybay
    .filter((i) => i.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 আয় ব্যয় হিসাব</h2>

      <p>মোট আয়: {income} ৳</p>
      <p>মোট ব্যয়: {expense} ৳</p>
      <p>ব্যালেন্স: {income - expense} ৳</p>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">আয়</option>
        <option value="expense">ব্যয়</option>
      </select>

      <button onClick={handleSubmit}>Add</button>

      <ul>
        {aybay.map((item) => (
          <li key={item.id}>
            {item.title} - {item.amount} ৳ ({item.type})
          </li>
        ))}
      </ul>
    </div>
  );
}