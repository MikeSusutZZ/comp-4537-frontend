import React from 'react'
import { Form, Formik } from 'formik'
import { registrationSchema } from '../schemas/schemas'
import { useNavigate } from 'react-router-dom'
import TextInput from './TextInput'
import { VStack, Button } from '@chakra-ui/react'

function LoginForm () {
  const navigate = useNavigate()

  return (
    <Formik
        /* When the form is intially showed to the user,
        all values are empty -- empty initial state */
        initialValues={{ email: '', password: '' }}
        validationSchema={registrationSchema}
        onSubmit={values => {
          console.log(values)

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
            w={'100%'}
            variant='solid'
            disabled={formik.isSubmitting}>
            Login
          </Button>
        </VStack>
      </Form>
    )}
    </Formik>
  )
}

export default LoginForm
