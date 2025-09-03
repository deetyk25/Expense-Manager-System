import axios from "axios";
import { getExpenses, addExpense, deleteExpense } from "./services/expenses";


const API = axios.create({ baseURL: "http://localhost:4000" });

export const getMessage = () => API.get("/");

