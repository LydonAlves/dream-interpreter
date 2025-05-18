import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='history' options={{headerShown: false}}/>
      <Stack.Screen name='logDream' options={{title: "Nuevo Sueño", headerShown: false}}/>
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})