import React from 'react'
import RegistrationPage from './pages/RegistrationPage'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './authentication/AuthContext'
import PrivateRoute from './authentication/PrivateRoute'

function App () {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        </Routes>
      </ChakraProvider>
    </AuthProvider>
  )
}

export default App
