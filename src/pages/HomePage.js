import styles from '../style/HomePage.module.css'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App () {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()
  const [apiCallCounter, setApiCallCounter] = useState(0) // Added API call counter state
  const MAX_API_CALLS = 20 // Set a constant for maximum allowed API calls

  useEffect(() => {
    // Attempt to fetch a protected route to check if the token is valid
    const checkAuth = async () => {
      try {
        const response = await fetch('https://comp-4537-pv5-project-backend-b23c9c33cda3.herokuapp.com/verify-token', {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Unauthorized')
      } catch (error) {
        console.error(error)
        navigate('/')
      }
    }

    checkAuth()
  }, [])

  const generateImage = async () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      const response = await fetch('https://comp-4537-pv5-project-backend-b23c9c33cda3.herokuapp.com/generate-image', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ prompt: lastMessage.content })
      })
      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.imageUrl)
        setApiCallCounter(prevCount => prevCount + 1) // Increment API call counter
      } else {
        console.error('Error generating image')
      }
    }
  }

  useEffect(() => {
    const initialUserMessage = {
      role: 'user',
      content: 'I am ready to start the Choose Your Own Adventure Game!'
    }
    fetchAssistantReply([initialUserMessage])
  }, [])

  const fetchAssistantReply = async (messageHistory) => {
    const response = await fetch('https://comp-4537-pv5-project-backend-b23c9c33cda3.herokuapp.com/chat', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ messages: messageHistory })
    })
    const data = await response.json()
    setMessages([
      ...messages,
      messageHistory[messageHistory.length - 1],
      { role: 'assistant', content: data.message }
    ])
    setApiCallCounter(prevCount => prevCount + 1) // Increment API call counter
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userMessage = { role: 'user', content: input }
    setInput('')
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    fetchAssistantReply(updatedMessages)
  }

  return (
    <div className={styles.app}>
      <h1>Choose Your Own Adventure Game!</h1>
      <div className="game-container">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
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
      <p>API Calls Remaining: {MAX_API_CALLS - apiCallCounter}</p> {/* Display remaining API calls */}
    </div>
  )
}

export default App
