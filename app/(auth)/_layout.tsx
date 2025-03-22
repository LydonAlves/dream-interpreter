import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen  
      name = 'chatPage'
      options={{
        title: 'Chat page',
        headerShadowVisible: false,
      }}/>
    </Stack>
  )
}

export default Layout