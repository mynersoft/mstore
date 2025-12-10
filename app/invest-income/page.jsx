import AddTransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";

export default function Home() {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Income & Investment Tracker</h2>
      <AddTransactionForm />
      <TransactionTable />
    </div>
  );
}