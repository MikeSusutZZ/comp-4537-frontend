import React from 'react'
import PropTypes from 'prop-types'

import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { useField } from 'formik'

// Validates props for `TextInput` component
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string
}

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
