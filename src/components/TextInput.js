import React from 'react'
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { useField } from 'formik'

// eslint-disable-next-line react/prop-types
function TextInput ({ name, label, type = 'text' }) {
  const [field, meta] = useField(name)
  return (
    <FormControl isInvalid={meta.error && meta.touched}>
      <FormLabel>{label}</FormLabel>
      <Input {...field} type={type} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default TextInput
