import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { VStack, Button, Box, useToast } from '@chakra-ui/react'
import axios from 'axios'

import { loginSchema } from '../schemas/schemas'
import TextInput from './TextInput'

// TODO: Create file for constants, user-facing messages

async function login (values, setSubmitting, setServerError) {
  setSubmitting(true)

  try {
    const response = await axios.post('http://localhost:4000/users/login', values, { withCredentials: true })

    const data = response.data
    if (data.isError) {
      console.error(data.data)
      return false
    }
    return true
  } catch (error) {
    if (!error.response) {
      setServerError("Server isn't responding. Please try again later.")
    } else {
      setServerError(error.response.data)
    }
    return false
  }
}

function LoginForm () {
  const toast = useToast()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    const success = await login(values, setSubmitting, setServerError)

    if (success) {
      toast({
        title: 'Login successful',
        description: "You've successfully logged in!",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      navigate('/home')
    } else {
      console.log(success.error)
      toast({
        title: 'Login failed',
        description: 'Please try again',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      setSubmitting(false)
    }
  }

  return (
    <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
    >
    {formik => (
      <Form>
        <VStack spacing={4}>

          <TextInput name='email' label="Email" />
          <TextInput name='password' label="Password" type="password" />

          {serverError && <Box color='red.500'>{serverError}</Box>}

          <Button
            type="submit"
            w={'100%'}
            variant='solid'
            isLoading={formik.isSubmitting}
            >
            Login
          </Button>

          <Box>
            <Button
              onClick={() => navigate('/register')}
              variant='link'
              colorScheme='blue'>
              No account? Register here
            </Button>
          </Box>

        </VStack>
      </Form>
    )}
    </Formik>
  )
}

export default LoginForm
