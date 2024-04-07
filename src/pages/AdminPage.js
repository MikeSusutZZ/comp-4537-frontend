import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../constants'

const AdminPage = () => {
  const [adminData, setAdminData] = useState([])
  const [refreshAdminData, setRefreshAdminData] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/verify-token`, {
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
        setAdminData(response.data)
      } catch (error) {
        console.error('Error fetching admin data', error)
      }
    }

    fetchAdminData()
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
      const response = await axios.delete(`${API_URL}/delete-user/${encodedEmail}`)
      setRefreshAdminData(!refreshAdminData)
      console.log('User deleted', response.data)
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }

  const promoteUser = async (email) => {
    console.log(`Resetting calls for email: ${email}`)
    try {
      const encodedEmail = encodeURIComponent(email)
      const response = await axios.patch(`${API_URL}/reset-api-call-count/${encodedEmail}`)
      setRefreshAdminData(!refreshAdminData)
      console.log('Reset successful', response.data)
      // Optional: Refresh admin data to reflect changes or give visual feedback
    } catch (error) {
      console.error('Error resetting calls', error)
    }
  }

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px'
  }

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '80%',
    maxWidth: '600px'
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
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((item, index) => (
            <tr key={index}>
              <td style={thTdStyle}>{item.email}</td>
              <td style={thTdStyle}>{item.apiCallCounter}</td>
              <td style={thTdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => resetCalls(item.email)} // Now using email to identify the user for reset
                >
                  Reset Calls
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => deleteUser(item.email)}
                >
                  Delete
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => promoteUser(item.email)}
                >
                  Promote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPage
