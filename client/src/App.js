import React, { useState, useEffect } from "react";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "./services/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ item: "", category: "", amount: "", date: "" });

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
  const handleDelete = async (_id) => {
    try {
      await deleteExpense(_id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditFields({ ...expense });
  };

  const handleSave = async (_id) => {
    try {
      await updateExpense(_id, {
        ...editFields,
        amount: parseFloat(editFields.amount) 
      });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

return (
    <div style={{ textAlign: "left", marginLeft: "20px", marginTop: "30px" }}>
      <h1>Personal Finance Tracker</h1>

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
          <li key={exp._id} style={{ margin: "10px 0" }}>
            {editingId === exp._id ? (
              <>
                <input
                  type="text"
                  value={editFields.item}
                  onChange={(e) =>
                    setEditFields({ ...editFields, item: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editFields.category}
                  onChange={(e) =>
                    setEditFields({ ...editFields, category: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editFields.amount}
                  onChange={(e) =>
                    setEditFields({ ...editFields, amount: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={editFields.date}
                  onChange={(e) =>
                    setEditFields({ ...editFields, date: e.target.value })
                  }
                />
                <button onClick={() => handleSave(exp._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {exp.date} - {exp.item} ({exp.category}) - ${Number(exp.amount).toFixed(2)}
                <button style={{ marginLeft: "10px" }} onClick={() => handleEdit(exp)}>
                  Edit
                </button>
                <button style={{ marginLeft: "10px" }} onClick={() => handleDelete(exp._id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
