import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native'
import { ResultsAction, resultsInitialState, resultsReducer, ResultsState } from '../reducers/ResultsScreenReducer';
import { useReducer } from 'react';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';

type ResultsScreenProps = {
  step: number;
  text: string;
  onSubmit: (formData: ResultsState) => void;
}

const initialFeedbackFields: {key: keyof ResultsState; placeholder: string;}[] = [
  {
    key: 'resonate',
    placeholder: 'Algo que te ha resoñado especialmente',
  },
  {
    key: 'disagree',
    placeholder: 'Algo con que no estoy de acuerdo',
  },
]

// const text = `**Psychological Insight:**
// Desde la perspectiva junguiana, el sueño que has compartido puede ser interpretado a través de varios símbolos y arquetipos que reflejan tu psique y tu proceso de individuación.

// 1. **La Casa de la Infancia**: En la teoría de Jung, la casa simboliza el yo y la psique del soñador. La casa donde creciste representa tu pasado, tus raíces y la base de tu identidad. El hecho de que esté abandonada y deteriorada sugiere que hay aspectos de tu infancia o de tu vida anterior que sientes que han sido descuidados o que ya no te sirven. Esto puede reflejar una lucha interna con la aceptación de tu historia personal y cómo esta influye en tu presente.
// 2. **El Agua/Inundación**: El agua es un símbolo poderoso en la psicología junguiana, a menudo asociado con el inconsciente, las emociones y la vida. La inundación puede representar una sobrecarga emocional, una sensación de estar abrumado por sentimientos que no has podido procesar. La lluvia torrencial puede simbolizar la llegada de nuevas emociones o cambios que están fuera de tu control, lo que puede estar relacionado con la etapa de cambios que estás atravesando en tu vida.
// 3. **La Foto Familiar**: Este símbolo puede representar la conexión con tu pasado y tus raíces familiares. Al encontrarla flotando, puede indicar que, a pesar de los cambios y la incertidumbre, hay una parte de ti que busca aferrarse a esos recuerdos y a la identidad que te han dado. La foto puede ser un recordatorio de lo que has vivido y de las relaciones que han formado tu ser.
// 4. **La Mesa**: Treparse a la mesa puede simbolizar un intento de encontrar estabilidad y seguridad en medio del caos. En la teoría junguiana, las mesas pueden representar un lugar de reunión, un espacio donde se comparte y se construye la comunidad. En este contexto, puede reflejar tu deseo de encontrar un lugar seguro en medio de la transformación que estás experimentando.
// 5. **Emociones de Angustia, Nostalgia y Miedo**: Estas emociones son indicativas de la lucha interna que sientes. La angustia puede estar relacionada con el miedo a lo desconocido y a la pérdida de lo familiar. La nostalgia sugiere un anhelo por lo que has dejado atrás, mientras que el deseo de proteger puede reflejar un instinto de cuidar de tu yo más joven o de las partes de ti que sientes que están en peligro de ser olvidadas o perdidas.

// En resumen, este sueño parece ser una manifestación de tu proceso de transformación personal. La inundación puede simbolizar la necesidad de enfrentar y procesar emociones profundas relacionadas con tu pasado y los cambios que estás viviendo. La casa, el agua y la foto familiar son símbolos que invitan a la reflexión sobre tu identidad, tus raíces y cómo estas influyen en tu camino hacia el futuro. Te animo a que explores estos sentimientos y símbolos en tu vida diaria, ya que pueden ofrecerte valiosas pistas sobre tu proceso de individuación y crecimiento personal.`;



//! When I have it up and running I should use flashlist to show the messages here: Stream
const ResultsScreen = ({step, text, onSubmit}: ResultsScreenProps) => {
// const ResultsScreen = ({step,  onSubmit}: ResultsScreenProps) => {
  const [state, dispatch] = useReducer(resultsReducer, resultsInitialState)
  console.log('step', step);
  const router = useRouter()



  //? look at the comments in the code below to continue with the update

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* <Markdown style={{ body: styles.text }}>
          <Text style={styles.text}>{text}</Text>
        </Markdown> */}
        <Text style={styles.text}>{text}</Text>
        {step === 2 && (
        initialFeedbackFields.map((field) => (
          <View key={`${field.key}-view`}>
            {/* Here I can add a button and the TextInput only appears if the user says yes */}
            <Text style={styles.label}>
              {field.key === 'resonate' 
              ? '¿Hay algo que te haya resonado especialmente?'
              : '¿Hay algo con lo que no estás de acuerdo?'}
              </Text>
              <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor="#aaa" 
                  style={styles.input}
                  value={state[field.key]}
                  multiline
                  onChangeText={(text) => 
                    dispatch({type: `SET_${field.key.toUpperCase()}` as ResultsAction["type"], payload: text })
                  }
                />  
          </View>
        ))
        )}
        {step == 3 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>"Después de leer mi interpretación,¿hay algo específico que te gustaría mejorar en tu vida?"</Text>
            <TextInput
              placeholder='Quiero mejorar...'
              placeholderTextColor="#aaa" 
              style={styles.input}
              value={state.improve}
              multiline
              onChangeText={(text) => 
                dispatch({type: `SET_IMPROVE` as ResultsAction["type"], payload: text })
              }
            />
          </View>  
        )}
        {step !== 4 ? 
        // <Button title="Enviar" onPress={() => onSubmit(state)} /> 
        <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(state)}>
          <Text style={styles.submitButtonText}>Enviar</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('../')}>
          <Text style={styles.submitButtonText}>Terminar</Text>
        </TouchableOpacity>
        }
        
      </View>
    </ScrollView>
  )
}

export default ResultsScreen


const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#2c2c2e',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 10,
    width: '85%',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 12,
    paddingTop:10,
    fontSize: 16,
    height: 100,
    backgroundColor: '#3a3a3c',
    color: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    position: 'absolute',
    bottom: 30, 
    left: 16,
    right: 16,

    backgroundColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    color: '#1c1c1e',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 