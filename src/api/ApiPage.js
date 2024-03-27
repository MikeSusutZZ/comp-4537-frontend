import React, { useState } from 'react'

const ApiPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [apiResponse, setApiResponse] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    // Placeholder for API call
    // Replace URL with your actual API endpoint
    const apiURL = 'YOUR_API_ENDPOINT_HERE'

    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputValue })
      })
      const data = await response.json()
      // Assuming the API response is the data you want to display
      setApiResponse(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setApiResponse('An error occurred. Please try again.')
    }
  }

  return (
    <div className="apiPage">
      <div className="inputSection">
        <form onSubmit={handleFormSubmit}>
          <label>
            Enter Text:
            <input type="text" value={inputValue} onChange={handleInputChange} />
          </label>
          <button type="submit">Send to API</button>
        </form>
      </div>
      <div className="outputSection">
        <h2>API Response:</h2>
        <p>{apiResponse}</p>
      </div>
      {/* Add styling as needed */}
    </div>
  )
}

export default ApiPage
