import React from 'react'
import { Form, Formik } from 'formik'
import { forgotPasswordSchema } from '../schemas/schemas'
import { VStack, Button, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TextInput from './TextInput'

async function requestPasswordReset (values, setSubmitting) {
  try {
    const response = await axios.post('http://localhost:4000/forgot-password', values)
    const data = response.data

    if (data.isError) {
      console.error(data.data)
      return { success: false }
    }
    return { success: true, token: data.token }
  } catch (error) {
    console.log(error)
    return { success: false }
  } finally {
    setSubmitting(false)
  }
}

function ForgotPasswordForm () {
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    const { success, token } = await requestPasswordReset(values, setSubmitting)

    if (success) {
      toast({
        title: 'Password reset process initiated',
        description: 'Redirecting you to reset your password',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      // Redirect user to reset password page with the token
      navigate(`/reset-password/${token}`)
    } else {
      toast({
        title: 'Password reset failed',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <VStack spacing={4}>
            <TextInput name="email" placeholder="Enter your email..." />
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                width={'100%'}
                variant={'solid'}
              >
                Recover Password
              </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default ForgotPasswordForm
