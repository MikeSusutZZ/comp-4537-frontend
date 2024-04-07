// ResetPasswordPage.js
import React from 'react'
import { Formik, Form } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import TextInput from '../components/TextInput'
import PageLayout from '../components/PageLayout'
import { API_URL } from '../constants'

const ResetPasswordForm = () => {
  const { token } = useParams() // This assumes you're using react-router-dom
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, values)
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated. You can now log in with your new password.',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      navigate('/login') // Use navigate to redirect
    } catch (error) {
      toast({
        title: 'Password Reset Failed',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      setSubmitting(false)
    }
  }

  return (
        <PageLayout>
        <Formik
            initialValues={{ newPassword: '' }}
            onSubmit={handleSubmit}
        >
            {formik => (
                <Form>
                    <VStack spacing={4}>
                        <TextInput
                            name='newPassword'
                            type='password'
                            placeholder='Enter your new password'
                        />
                        <Box width={'100%'}>
                            <Button
                                type='submit'
                                isLoading={formik.isSubmitting}
                                width={'100%'}
                                variant={'solid'}
                            >
                                Reset Password
                            </Button>
                        </Box>
                    </VStack>
                </Form>
            )}
        </Formik>
        </PageLayout>
  )
}

export default ResetPasswordForm
