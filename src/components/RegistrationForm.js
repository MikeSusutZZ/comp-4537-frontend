import React, { useState } from 'react'
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { VStack, Button, Box, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { API_URL } from '../constants'

import TextInput from './TextInput'
import { registrationSchema } from '../schemas/schemas'

async function register (values, isSubmitting, setServerError) {
  isSubmitting(true)

  try {
    const response = await axios.post(`${API_URL}/users`, values, { withCredentials: true })

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

function RegistrationForm () {
  const toast = useToast()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    const success = await register(values, setSubmitting, setServerError)

    if (success) {
      toast({
        title: 'Registration successful',
        description: "You've successfully registered!",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      navigate('/login')
    } else {
      console.log(success.error)
      toast({
        title: 'Registration failed',
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
        validationSchema={registrationSchema}
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
            isLoading={formik.isSubmitting}>
            Sign Up
          </Button>

          <Box>
            <Button
              onClick={() => navigate('/login')}
              variant='link'
              colorScheme='blue'>
              Already have an account? Log in
            </Button>
          </Box>

        </VStack>
      </Form>
    )}
    </Formik>
  )
}

export default RegistrationForm
