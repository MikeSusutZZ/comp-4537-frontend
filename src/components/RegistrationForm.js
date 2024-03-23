import React from 'react'
import { Form, Formik } from 'formik'
import { registrationSchema } from '../schemas/schemas'
import { useNavigate } from 'react-router-dom'
import TextInput from './TextInput'
import { VStack, Button } from '@chakra-ui/react'
import axios from 'axios'

function RegistrationForm () {
  const navigate = useNavigate()

  return (
    <Formik
        /* When the form is intially showed to the user,
        all values are empty -- empty initial state */
        initialValues={{ email: '', password: '' }}
        validationSchema={registrationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Make an HTTP request to your backend
            await axios.post('http://localhost:4000/users', values)
            navigate('/login')
          } catch (error) {
            console.error(error)
            // If the request fails, you might want to handle errors
            // For example, show an error message
          }
          setSubmitting(false) // Ensure we unset submitting state regardless of outcome
        }}
    >
    {formik => (
      <Form>
        <VStack spacing={4}>
          <TextInput name='email' label="Email" />
          <TextInput name='password' label="Password" type="password" />

          <Button
            type="submit"
            w={'100%'}
            variant='solid'
            disabled={formik.isSubmitting}>
            Sign Up
          </Button>
        </VStack>
      </Form>
    )}
    </Formik>
  )
}

export default RegistrationForm
