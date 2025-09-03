import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_URI });

export const getMessage = () => API.get("/");

