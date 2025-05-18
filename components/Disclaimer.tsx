import { Disclaimer } from '@/types/disclaimer';
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const dreamDisclaimer: Disclaimer = [
  "Estas interpretaciones se basan en una abundante bibliografía sobre análisis de sueños y bases de datos de símbolos, pero esto sigue siendo solo una IA echando una mano.",
  "Toma solo lo que resuene contigo, y deja de lado todo lo que no te convenza.",
  "Si deseas explorar tus sueños más a fondo, considera compartirlos con alguien de tu confianza; puede ser muy gratificante reflexionar juntos.",
  "Duerme bien, sigue soñando y confía en tu propia sabiduría interior.",
];

const DisclaimerScreen = () => {
  const [visible, setVisible] = useState(true)


  return (
    <>
    {visible && (
      <View style={styles.container}>
        {dreamDisclaimer.map((line, i) =>(
          <Text key={i} style={styles.text}>
            {line}
          </Text>
        ))}
        <TouchableOpacity onPress={() => setVisible(false)} style={styles.okButton}>
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>
      )}
    </>
  )
}

export default DisclaimerScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex:100,
  },
  text: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  okButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',     
    borderRadius: 6,                
    alignSelf: 'center',            
  },
  okText: {
    color: '#fff',                 
    fontSize: 16,
    fontWeight: '600',             
    textAlign: 'center',
  },
});