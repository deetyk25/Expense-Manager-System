import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected!"))
.catch((err) => console.error("MongoDB connection error:", err));

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Expense schema and model
const expenseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
app.post("/expenses", async (req, res) => {
  const { item, category, amount, date } = req.body;
  if (!item || !category || !amount || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const newExpense = new Expense({ item, category, amount, date });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an expense
app.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an expense
app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) return res.status(404).json({ message: "Expense not found" });
    res.json(deletedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

