import React from 'react'
import { Flex, Box, Heading } from '@chakra-ui/react'

// eslint-disable-next-line react/prop-types
function PageLayout ({ children }) {
  return (
    <Flex
      w={'100vw'}
      h={'100vh'}
      flexDirection="column"
      justifyContent={'center'}
      alignItems={'center'}
      minWidth={400}
      >

      <Heading>Infinite Dungeon Krawler</Heading>

      {/* Children passed will be, for example,
      the Login or Registration forms. */}
      <Box
        width={{ base: '90%', md: '50%' }}
        padding={10}>
        {children}
      </Box>
    </Flex>
  )
}

export default PageLayout
