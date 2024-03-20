// HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const initialUserMessage = {
      role: "user",
      content: "I am ready to start the Choose Your Own Adventure Game!",
    };
    fetchAssistantReply([initialUserMessage]);
  }, []);

  const fetchAssistantReply = async (messageHistory) => {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messageHistory }),
    });

    const data = await response.json();
    setMessages([
      ...messages,
      messageHistory[messageHistory.length - 1],
      { role: "assistant", content: data.message },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { role: "user", content: input };
    setInput("");
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    fetchAssistantReply(updatedMessages);
  };

  return (
    <div className="app">
      <h1>Choose Your Own Adventure Game!</h1>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.role}`}>
            {message.content}
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
