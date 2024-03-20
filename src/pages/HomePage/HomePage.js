// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([...messages, { text: input, sender: "user" }]);

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    console.log(data);
    setMessages([
      ...messages,
      { text: input, sender: "user" },
      { text: data.message, sender: "bot" },
    ]);
    setInput("");
  };

  return (
    <div className="app">
      <h1>Phi-2 Chat Game</h1>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
