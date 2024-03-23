import React from 'react'
// import LandingPage from "./pages/LandingPage";
import RegistrationPage from './pages/RegistrationPage'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import LoginPage from './pages/LoginPage'

function App () {
  return (
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </ChakraProvider>
  )
}

export default App
