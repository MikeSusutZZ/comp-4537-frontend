// HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const [apiCallCounter, setApiCallCounter] = useState(0);
  const MAX_API_CALLS = 20;
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prompt: lastMessage.content }),
      });
      setIsLoading(false);
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
        setApiCallCounter(data.apiCallCounter);
      } else if (response.status === 403) {
        alert("You have exceeded the maximum number of API calls.");
      } else {
        console.error("Error generating image");
      }
    }
  };

  useEffect(() => {
    const initialUserMessage = {
      role: "user",
      content: "I am ready to start the Choose Your Own Adventure Game!",
    };
    fetchAssistantReply([initialUserMessage]);
  }, []);

  const fetchAssistantReply = async (messageHistory) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ messages: messageHistory }),
    });
    setIsLoading(false);
    if (response.ok) {
      const data = await response.json();
      setMessages([
        ...messages,
        messageHistory[messageHistory.length - 1],
        { role: "assistant", content: data.message },
      ]);
      setApiCallCounter(data.apiCallCounter);
    } else if (response.status === 401) {
      // Unauthorized - token is missing or invalid
      console.error("Unauthorized: Token is missing or invalid");
      // Handle the case when the token is missing or invalid
      // For example, redirect the user to the login page
      navigate("/");
    } else if (response.status === 403) {
      alert("You have exceeded the maximum number of API calls.");
    } else {
      console.error("Error fetching assistant reply");
    }
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
      <div className="game-container">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
          {isLoading && <div className="loading-spinner"></div>}
        </div>
        {imageUrl && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated Scene" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={generateImage}>Generate Image</button>
      <p>API Calls Remaining: {MAX_API_CALLS - apiCallCounter}</p>
    </div>
  );
}

export default App;
