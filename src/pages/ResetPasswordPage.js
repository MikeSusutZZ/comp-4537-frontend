import React from 'react'
import ResetPasswordForm from '../components/ForgotPasswordForm'
import { Text } from '@chakra-ui/react'
import PageLayout from '../components/PageLayout'

function ForgotPasswordPage () {
  return (
    <PageLayout>

        <Text fontSize="xl" as="b"> Forgot Your Password? </Text>
        <ResetPasswordForm />

    </PageLayout>
  )
}

export default ForgotPasswordPage
