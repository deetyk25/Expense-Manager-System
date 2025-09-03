import React, { useState, useEffect } from "react";
import { getExpenses, addExpense, deleteExpense } from "./services/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!item || !category || !amount || !date) return;
    try {
      await addExpense({ item, category, amount: parseFloat(amount), date });
      setItem("");
      setCategory("");
      setAmount("");
      setDate("");
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div style={{ textAlign: "left", marginTop: "30px" }}>
      <h1>Expense Manager System</h1>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
      {/* Expense List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map((exp) => (
          <li key={exp.id} style={{ margin: "10px 0" }}>
            {exp.date} - <strong>{exp.item}</strong> ({exp.category}) - $
            {exp.amount.toFixed(2)}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(exp.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
