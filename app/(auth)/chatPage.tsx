import { DreamInfoAction, dreamInfoReducer, DreamInfoState, initialState } from '@/components/DreamInfoReducer'
import { useEffect, useReducer } from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'

const inputFields: {key: keyof DreamInfoState; placeholder: string; multiline: boolean}[] = [
  {
    key: 'dreamText',
    placeholder: 'Cuenta un sueño',
    multiline: true,
  },
  {
    key: 'symbols',
    placeholder: '¿Qué son los simbolos principales para ti?',
    multiline: true,
  },
  {
    key: 'emotion',
    placeholder: 'Emoción: ¿Qué sentiste?',
    multiline: true,
  },
  {
    key: 'currentLife',
    placeholder: '¿Qué está pasando en tu vida en este momento?',
    multiline: true,
  },
  {
    key: 'dreamTitle',
    placeholder: 'Ponle un titulo a tu sueño como si fuera una pelicula',
    multiline: false,
  },
];


const ChatPage = () => {
  const [state, dispatch] = useReducer(dreamInfoReducer, initialState)

  // useEffect(() => {
  //   console.log('Updated state:', state);
  // }, [state]);

  const handleSubmit = () => {
    console.log('Updated state:', state);
  }

 
  return (
    <View style={styles.container}>
      {inputFields.map((field) => (
    <View key={field.key} style={styles.inputContainer}>
      <Text style={styles.label}>{field.placeholder}</Text>
      <TextInput
        key={field.key}
        style={[styles.input, field.multiline && styles.textArea]}
        placeholder={field.placeholder}
        value={state[field.key]}
        onChangeText={(text) =>
          dispatch({ type: `SET_${field.key.toUpperCase()}` as DreamInfoAction["type"], payload: text })
        }
        multiline={field.multiline}
        textAlignVertical={field.multiline ? 'top' : 'center'}
      />
    </View>
  ))}
      <Button title="Enviar sueño" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16, // Space between input fields
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333", // Dark gray text
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100, 
  },

});


export default ChatPage