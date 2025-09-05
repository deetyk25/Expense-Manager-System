import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getExpenses, addExpense, updateExpense, deleteExpense, getExpensesByCategory } from "./services/expenses";

const COLORS = ["#D2042D", "#000080", "#AA336A", "#D2B48C", "#00C49F", "#0088FE"];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ item: "", category: "", amount: "", date: "" });

  const [categoryData, setCategoryData] = useState([]);

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await getExpenses();
      // sorts
      const sorted = [...response.data].sort((a, b) => a.category.localeCompare(b.category));
      setExpenses(sorted);
      fetchCategoryData(); // update pie chart whenever expenses change
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Fetch category data for pie chart
  const fetchCategoryData = async () => {
    try {
      const response = await getExpensesByCategory();
      const formatted = response.data.map(d => ({ name: d._id, value: d.totalAmount }));
      console.log("Category Data:", formatted); // check data
      setCategoryData(formatted);
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  };

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!item || !category || !amount || !date) return;
    try {
      await addExpense({ item, category, amount: parseFloat(amount), date });
      setItem(""); setCategory(""); setAmount(""); setDate("");
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Delete expense
  const handleDelete = async (_id) => {
    try {
      await deleteExpense(_id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Edit/save handlers
  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditFields({ ...expense });
  };
  const handleSave = async (_id) => {
    try {
      await updateExpense(_id, { ...editFields, amount: parseFloat(editFields.amount) });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // Sorting
  const sortExpenses = (criteria) => {
    const sorted = [...expenses];
    if (criteria === "date-desc") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (criteria === "date-asc") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (criteria === "amount-asc") sorted.sort((a, b) => a.amount - b.amount);
    else if (criteria === "amount-desc") sorted.sort((a, b) => b.amount - a.amount);
    else if (criteria === "category") sorted.sort((a, b) => a.category.localeCompare(b.category));
    setExpenses(sorted);
  };

  return (
    <div style={{ textAlign: "left", marginLeft: "20px", marginTop: "30px" }}>
      <h1>Expense Manager System</h1>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit">Add Expense</button>
      </form>

      {/* Sorting Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Sort by:</label>
        <select onChange={(e) => sortExpenses(e.target.value)}>
          <option value="category">Category (Alphabetical)</option>
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="amount-asc">Amount (Low → High)</option>
          <option value="amount-desc">Amount (High → Low)</option>
        </select>
      </div>

      {/* Expense List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map(exp => (
          <li key={exp._id} style={{ margin: "10px 0" }}>
            {editingId === exp._id ? (
              <>
                <input type="text" value={editFields.item} onChange={(e) => setEditFields({ ...editFields, item: e.target.value })} />
                <input type="text" value={editFields.category} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })} />
                <input type="number" value={editFields.amount} onChange={(e) => setEditFields({ ...editFields, amount: e.target.value })} />
                <input type="date" value={editFields.date} onChange={(e) => setEditFields({ ...editFields, date: e.target.value })} />
                <button onClick={() => handleSave(exp._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {exp.date} - {exp.item} ({exp.category}) - ${Number(exp.amount).toFixed(2)}
                <button style={{ marginLeft: "10px" }} onClick={() => handleEdit(exp)}>Edit</button>
                <button style={{ marginLeft: "10px" }} onClick={() => handleDelete(exp._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Pie Chart */}
      {categoryData.length > 0 && (
        <div style={{ width: 400, height: 300, marginTop: "50px" }}>
          <h2>Expenses by Category</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;

