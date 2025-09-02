import React, { useState } from "react";
import { getMessage } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  const fetchMessage = async () => {
    try {
      const response = await getMessage();
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching message:", error);
      setMessage("Error connecting to backend");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Personal Finance Tracker</h1>
      <button onClick={fetchMessage}>Get Backend Message</button>
      <p>{message}</p>
    </div>
  );
}

export default App;

