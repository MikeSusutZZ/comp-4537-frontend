import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { VStack, Button, Box } from '@chakra-ui/react'
import axios from 'axios'
import { API_URL } from '../constants'

import { loginSchema } from '../schemas/schemas'
import TextInput from './TextInput'

// TODO: Create file for constants, user-facing messages
// TODO: Create server status response constants
// TODO: Replace alert with Chakra UI Toast

function LoginForm () {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  return (
    <Formik
        initialValues={{ email: '', password: '' }}

        validationSchema={loginSchema}

        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post(`${API_URL}/users/login`, values, { withCredentials: true })

            if (response.status === 200) {
              alert("You've successfully logged in!")
              navigate('/home')
            }
          } catch (error) {
            if (!error.response) {
              setServerError("Server isn't responding. Please try again later.")
            } else if (error.response.status === 401) {
              setServerError(error.response.data)
            } else if (error.response.status === 404) {
              setServerError(error.response.data)
            } else if (error.response.status === 500) {
              setServerError(error.response.data)
            }
          } finally {
            setSubmitting(false)
          }
        }}
    >
    {formik => (
      <Form>
        <VStack spacing={4}>

          <TextInput name='email' label="Email" />
          <TextInput name='password' label="Password" type="password" />

          {serverError && <Box color='red.500'>{serverError}</Box>}

          <Button
            type="submit"
            isLoading={formik.isSubmitting}
            w={'100%'}
            variant='solid'>
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
