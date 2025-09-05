import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_URI, // backend
  // previously had proxy in json
});

// Get all expenses
export const getExpenses = () => API.get("/expenses");

// Add expense
export const addExpense = (expense) => API.post("/expenses", expense);

// Update expense
export const updateExpense = (id, expense) => API.put(`/expenses/${id}`, expense);

// Delete expense
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

// services/expenses.js
// export const getExpensesByCategory = async () => {
//   try {
//     const response = await fetch("/expenses/by-category");
//     return response.json();
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };
export const getExpensesByCategory = () => API.get("/expenses/by-category");

