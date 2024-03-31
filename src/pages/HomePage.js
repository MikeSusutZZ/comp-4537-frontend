import styles from '../style/HomePage.module.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App () {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()
  const [apiCallCounter, setApiCallCounter] = useState(0)
  const MAX_API_CALLS = 20

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:4000/verify-token', {
          method: 'GET',
          credentials: 'include'
        })
        if (!response.ok) {
          const error = new Error('Unauthorized')
          error.response = response
          throw error
        }
        // You can process the response if it's needed here...
      } catch (error) {
        console.error(error)
        navigate('/login') // Navigate to login if unauthorized
      }
    }

    checkAuth()
  }, [navigate])

  const generateImage = async () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      try {
        const response = await fetch('http://localhost:4000/generate-image', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ prompt: lastMessage.content }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to generate image')
        }
        const data = await response.json()
        setImageUrl(data.imageUrl)
        setApiCallCounter(prevCount => prevCount + 1)
      } catch (error) {
        console.error(error.message)
      }
    }
  }

  // This useEffect will only run once, on component mount
  useEffect(() => {
    const initialUserMessage = {
      role: 'user',
      content: 'I am ready to start the Choose Your Own Adventure Game!'
    }
    fetchAssistantReply([initialUserMessage])
  }, [])

  const fetchAssistantReply = async (messageHistory) => {
    try {
      const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ messages: messageHistory }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch assistant reply')
      }
      const data = await response.json()
      setMessages(prevMessages => [
        ...prevMessages,
        messageHistory[messageHistory.length - 1],
        { role: 'assistant', content: data.message }
      ])
      setApiCallCounter(prevCount => prevCount + 1)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userMessage = { role: 'user', content: input }
    setInput('')
    fetchAssistantReply([...messages, userMessage])
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
      <p>API Calls Remaining: {MAX_API_CALLS - apiCallCounter}</p>
    </div>
  )
}

export default App
