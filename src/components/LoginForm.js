import React, { useContext } from 'react'
import { Form, Formik } from 'formik'
import { registrationSchema } from '../schemas/schemas'
import { useNavigate } from 'react-router-dom'
import TextInput from './TextInput'
import { VStack, Button } from '@chakra-ui/react'
import { AuthContext } from '../authentication/AuthContext'
import axios from 'axios'

function LoginForm () {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <Formik
        /* When the form is intially showed to the user,
        all values are empty -- empty initial state */
        initialValues={{ email: '', password: '' }}
        validationSchema={registrationSchema}

        /* Formik will validate the form fields based on the
        above 'registrationSchema'; if these pass validation,
        the form is submitted. */
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post('http://localhost:4000/users/login', values)
            localStorage.setItem('token', response.data.token) // Store the token
            login(values) // Update login state
            navigate('/home') // Navigate to the home page
          } catch (error) {
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

          <Button
            type="submit"
            isLoading={formik.isSubmitting}
            w={'100%'}
            variant='solid'>
            Login
          </Button>
        </VStack>
      </Form>
    )}
    </Formik>
  )
}

export default LoginForm
