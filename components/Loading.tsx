import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

type LoadingProps = {
  loading: boolean;
}

const Loading = ({loading}: LoadingProps) => {
  if(!loading) return null;

  return (
     <View style={loadingStyles.loadingOverlay}>
          <ActivityIndicator size='large' color='#fff' />
      </View>
  )
}

export default Loading

const loadingStyles = StyleSheet.create ({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
})