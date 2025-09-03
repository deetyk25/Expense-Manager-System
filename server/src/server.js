import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let expenses = [
  { id: 1, item: "Notebook", category: "School", amount: 12, date: "2025-08-12" },
  { id: 2, item: "Dinner", category: "Food", amount: 3, date: "2025-08-16" }
];

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/expenses", (req, res) => {
  const { item, category, amount, date } = req.body;
  if (!item || !category || !amount || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const newExpense = {
    id: expenses.length + 1,
    item,
    category,
    amount,
    date
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

app.put("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { item, category, amount, date } = req.body;
  const expense = expenses.find(exp => exp.id == id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  expense.item = item ?? expense.item;
  expense.category = category ?? expense.category;
  expense.amount = amount ?? expense.amount;
  expense.date = date ?? expense.date;

  res.json(expense);
});

app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex(exp => exp.id == id);
  if (index === -1) return res.status(404).json({ message: "Expense not found" });

  const deleted = expenses.splice(index, 1);
  res.json(deleted[0]);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

