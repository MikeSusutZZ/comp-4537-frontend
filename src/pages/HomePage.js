import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../constants'
import { useToast } from '@chakra-ui/react'

function App () {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedImage, setExpandedImage] = useState(null)
  const navigate = useNavigate()
  const [apiCallCounter, setApiCallCounter] = useState(0)
  const MAX_API_CALLS = 20
  const toast = useToast()

  useEffect(() => {
    // Check authentication on mount
    checkAuth()
  }, [navigate])

  useEffect(() => {
    async function getCallCount () {
      fetch(`${API_URL}/api-call-count`, {
        method: 'GET',
        credentials: 'include'
      }).then((res) => {
        return res.json()
      }).then(({ count }) => {
        setApiCallCounter(parseInt(count))
      })
    }

    try {
      getCallCount()
    } catch (err) {
      console.error(err)
    }
  })

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/verify-token`, {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Unauthorized')
      }
      // Authorization successful
    } catch (error) {
      console.error(error)
      navigate('/login') // Navigate to login if unauthorized
    }
  }

  const logOut = async () => {
    try {
      const response = await fetch(`${API_URL}/users/logout`, { method: 'POST' })
      if (!response.ok) {
        throw new Error('Could not log out')
      }
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not log out. Please try again.',
        status: 'error',
        duration: 1500,
        isClosable: true
      })
    }
  }

  const generateImage = async () => {
    setIsLoading(true)
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      try {
        const response = await fetch(`${API_URL}/generate-image`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ prompt: lastMessage.content }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (handleSessionTimeout(response)) return
        if (!response.ok) {
          throw new Error('Failed to generate image')
        }
        const data = await response.json()
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'image', content: data.imageUrl }
        ])
        setApiCallCounter((prevCount) => prevCount + 1)
      } catch (error) {
        toast({
          title: 'Error Generating Image',
          description: error.message,
          status: 'error',
          duration: 1500,
          isClosable: true
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const fetchAssistantReply = async (messageHistory) => {
    try {
      const filteredMessageHistory = messageHistory.filter(
        (message) => message.role !== 'image'
      )
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ messages: filteredMessageHistory }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (handleSessionTimeout(response)) return
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const data = await response.json()
      setMessages((prevMessages) => [
        ...prevMessages,
        messageHistory[messageHistory.length - 1],
        { role: 'assistant', content: data.message }
      ])
      setApiCallCounter((prevCount) => prevCount + 1)
    } catch (error) {
      toast({
        title: 'Error Generating Reply',
        description: error.message,
        status: 'error',
        duration: 1500,
        isClosable: true
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userMessage = { role: 'user', content: input }
    setInput('')
    fetchAssistantReply([...messages, userMessage])
  }

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl)
  }

  const handleCloseExpandedImage = () => {
    setExpandedImage(null)
  }

  const handleSessionTimeout = (res) => {
    if (res.status === 401) {
      toast({
        title: 'Error',
        description: 'Session timed out. Please log in again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return true
    }
    return false
  }

  const RenderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className="mb-6">
        {message.role === 'image'
          ? (
          <div className="image-container cursor-pointer" onClick={() => handleImageClick(message.content)}>
            <img src={message.content} alt="Generated Scene" className="rounded-lg max-w-full h-auto mx-auto max-h-96" />
          </div>
            )
          : (
          <div className={`chat-bubble p-4 rounded-lg ${message.role === 'user' ? 'bg-button-green' : 'bg-blue-500'}`}>
            {message.content}
          </div>
            )}
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-8">
          <button className='px-6 py-4 bg-blue-400 text-lg rounded-lg font-bold self-end' onClick={logOut}>Logout</button>
          <div className="chat-window overflow-auto p-6 bg-background-green rounded-lg max-h-[calc(100vh-200px)]">
            {
            messages.length > 0
              ? RenderMessages()
              : <div className="flex justify-center items-center py-6">
                  <i className='font-light text-2xl'>
                    Begin with a prompt to start your amazing adventure!
                  </i>
                </div>
            }
            {isLoading && (
              <div className="flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 mt-8">
          <input
            className="flex-1 p-4 border rounded-lg bg-gray-700 text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <div className="flex space-x-4">
            <button type="submit" className="px-6 py-4 bg-button-green rounded-lg text-lg font-semibold">Send</button>
            <button type="button" onClick={generateImage} className="px-6 py-4 bg-button-green rounded-lg text-lg font-semibold">Generate Image</button>
          </div>
        </form>
        <p className="mt-4 text-xl text-center">API Calls Remaining: {MAX_API_CALLS - apiCallCounter}</p>
      </div>
      {expandedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={handleCloseExpandedImage}>
          <img src={expandedImage} alt="Expanded Image" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  )
}

export default App
