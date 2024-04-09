import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../constants'

const AdminPage = () => {
  const [adminData, setAdminData] = useState([])
  const [routeStats, setRouteStats] = useState([]) // Step 1: State for route stats
  const [refreshAdminData, setRefreshAdminData] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/verify-admin`, {
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

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`)
        setAdminData(response.data.map(user => ({
          ...user,
          isAdminSymbol: user.isAdmin ? '✔️' : '❌' // Adding symbolic representation
        })))
      } catch (error) {
        console.error('Error fetching admin data', error)
      }
    }

    fetchAdminData()
  }, [refreshAdminData])

  useEffect(() => {
    // Step 2: Fetch Data
    const fetchRouteStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api-route-stats`, {
          withCredentials: true // Assuming your API requires credentials
        })
        setRouteStats(response.data)
      } catch (error) {
        console.error('Error fetching route stats', error)
      }
    }

    fetchRouteStats()
  }, [refreshAdminData])

  const resetCalls = async (email) => {
    console.log(`Resetting calls for email: ${email}`)
    try {
      const encodedEmail = encodeURIComponent(email)
      const response = await axios({
        method: 'patch',
        url: `${API_URL}/reset-api-call-count/${encodedEmail}`,
        withCredentials: true
      })
      setRefreshAdminData(!refreshAdminData)
      console.log('Reset successful', response.data)
      // Optional: Refresh admin data to reflect changes or give visual feedback
    } catch (error) {
      console.error('Error resetting calls', error)
    }
  }

  const deleteUser = async (email) => {
    console.log(`Deleting user with email: ${email}`)
    try {
      const encodedEmail = encodeURIComponent(email)
      const response = await axios({
        method: 'delete', // Specify the method as 'delete'
        url: `${API_URL}/delete-user/${encodedEmail}`, // Set the URL with the encoded email
        withCredentials: true // Include credentials if needed, as in your PATCH example
      })
      setRefreshAdminData(!refreshAdminData)
      console.log('User deleted', response.data)
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }

  const promoteUser = async (email) => {
    console.log(`Promoting user with email: ${email}`)
    try {
      const encodedEmail = encodeURIComponent(email)
      const response = await axios({
        method: 'patch', // Specify the method as 'patch'
        url: `${API_URL}/promote-user/${encodedEmail}`, // Set the URL with the encoded email
        withCredentials: true // Include credentials if needed for cross-origin requests
      })
      setRefreshAdminData(!refreshAdminData)
      console.log('Promotion Successful', response.data)
    } catch (error) {
      console.error('Error promoting user', error)
    }
  }

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px'
  }

  const tableWrapperStyle = {
    maxWidth: '100%', // Set the max width to prevent overflow
    overflowX: 'auto' // Enable horizontal scrolling
  }

  const tableStyle = {
    borderCollapse: 'collapse',
    minWidth: '600px' // Ensure table has a minimum width
  }

  const thTdStyle = {
    border: '1px solid #ddd',
    textAlign: 'left',
    padding: '8px'
  }

  const thStyle = {
    ...thTdStyle,
    backgroundColor: '#f2f2f2'
  }

  const buttonStyle = {
    cursor: 'pointer',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white'
  }

  return (
    <div style={pageStyle}>
      <h1>Admin Dashboard</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>API Calls</th>
            <th style={thStyle}>Is Admin</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((item, index) => (
            <tr key={index}>
              <td style={thTdStyle}>{item.email}</td>
              <td style={thTdStyle}>{item.apiCallCounter}</td>
              <td style={thTdStyle}>{item.isAdminSymbol}</td>
              <td style={thTdStyle}>
                <button style={buttonStyle} onClick={() => resetCalls(item.email)}>
                  Reset Calls
                </button>
                <button style={buttonStyle} onClick={() => deleteUser(item.email)}>
                  Delete
                </button>
                <button style={buttonStyle} onClick={() => promoteUser(item.email)}>
                  Promote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>API Route Statistics</h2>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User Email</th>
              <th style={thStyle}>HTTP Method</th>
              <th style={thStyle}>Route</th>
              <th style={thStyle}>Count</th>
            </tr>
          </thead>
          <tbody>
            {routeStats.map((stat, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{stat.email}</td>
                <td style={thTdStyle}>{stat.method}</td>
                <td style={thTdStyle}>{stat.route}</td>
                <td style={thTdStyle}>{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPage
