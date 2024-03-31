import React, { useEffect, useState } from 'react'
import axios from 'axios'

const adminDataAPI = 'https://comp-4537-pv5-project-backend-b23c9c33cda3.herokuapp.com/users' // Updated API endpoint

const AdminPage = () => {
  const [adminData, setAdminData] = useState([]) // State to store admin data

  useEffect(() => {
    // Fetch admin data on component mount
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(adminDataAPI)
        setAdminData(response.data) // Set fetched data to state
      } catch (error) {
        console.error('Error fetching admin data', error)
      }
    }

    fetchAdminData()
  }, []) // Empty dependency array means this runs once on mount

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

  return (
    <div style={pageStyle}>
      <h1>Admin Dashboard</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>API Calls</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((item, index) => (
            <tr key={index}>
              <td style={thTdStyle}>{item.email}</td>
              <td style={thTdStyle}>{item.apiCallCounter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPage
