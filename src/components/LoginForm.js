import React, { useContext } from 'react'
import { Form, Formik } from 'formik'
import { registrationSchema } from '../schemas/schemas'
import { useNavigate } from 'react-router-dom'
import TextInput from './TextInput'
import { VStack, Button } from '@chakra-ui/react'
import { AuthContext } from '../authentication/AuthContext'

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
        onSubmit={(values, { setSubmitting }) => {
          console.log(values)

          /* When the form is submitted, the 'login' function
          from the AuthContext is called, which sets the user's
          authentication status to 'true'. */
          login(values)
          setSubmitting(false)

          /* When user succesfully logs in, navigate to the
          home page, where the user will make API calls. */
          navigate('/home')
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
