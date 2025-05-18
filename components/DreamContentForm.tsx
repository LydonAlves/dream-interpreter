import { DreamInfoAction, dreamInfoReducer, DreamInfoState, initialState, InputAction } from '@/reducers/DreamInfoReducer'
import { analyzeDream } from '@/lib/dreamService';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useReducer, useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import Loading from './Loading';


const fakeDream = "Estoy en la casa donde crecí, pero está abandonada y deteriorada. Empieza a llover torrencialmente, y de pronto el agua comienza a filtrarse por las ventanas y a subir desde el suelo. Trato de correr de una habitación a otra, pero cada una está más llena de agua que la anterior. Encuentro una foto antigua de mi familia flotando, la agarro y me trepo a una mesa. La casa cruje, parece que va a colapsar. Justo cuando el agua me llega al cuello, me despierto."

type DreamContentProps = {
  onSubmit: (formData: DreamInfoState) => void;
  step: number;
  dreamID: string;
}

type InputFieldKey = keyof DreamInfoState['inputs']

const inputFields: {
  step: number, 
  key: InputFieldKey; 
  placeholder: string; 
  multiline: boolean
}[] = [
  {
    step: 0,
    key: 'dream_text',
    placeholder: 'Cuenta un sueño',
    multiline: true,
  },
  {
    step: 0,
    key: 'dream_title',
    placeholder: 'Ponle un titulo a tu sueño como si fuera una pelicula',
    multiline: false,
  },
  {
    step: 2,
    key: 'emotion',
    placeholder: 'Emoción: ¿Qué sentiste?',
    multiline: true,
  },
  {
    step: 3,
    key: 'current_life',
    placeholder: '¿Qué está pasando en tu vida en este momento?',
    multiline: true,
  },
];

const keyToInputActionType: Record<keyof DreamInfoState["inputs"], InputAction["type"]> = {
  dream_text: 'SET_DREAM_TEXT',
  emotion: 'SET_EMOTION',
  current_life: 'SET_CURRENT_LIFE',
  dream_title: 'SET_DREAM_TITLE',
};

const testSymbols = [
  { symbol: "casa", meaning: "Representa el yo; diferentes habitaciones reflejan aspectos de la psique.", isEditing: false },
  { symbol: "agua", meaning: "Simboliza el inconsciente, las emociones y la transformación.", isEditing: false },
  { symbol: "ventanas", meaning: "Indican percepción, conciencia y apertura hacia nuevas ideas o verdades.", isEditing: false },
  { symbol: "foto antigua", meaning: "Conexión con el pasado, la memoria o partes reprimidas del inconsciente.", isEditing: false },
  { symbol: "familia", meaning: "Aspectos fundamentales de la identidad y las influencias del inconsciente personal.", isEditing: false },
  { symbol: "mesa", meaning: "Lugar de unión, diálogo interno y estructura psicológica compartida.", isEditing: false },
  { symbol: "deterioro", meaning: "Indica procesos de cambio, envejecimiento psíquico o necesidad de renovación.", isEditing: false },
  { symbol: "colapso", meaning: "Representa crisis interna o desintegración de estructuras psíquicas obsoletas.", isEditing: false },
];




const DreamContentForm = ( { onSubmit, step, dreamID }: DreamContentProps, ) => {
  const [state, dispatch] = useReducer(dreamInfoReducer, initialState)
  const router = useRouter()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const steps: string[] = ['intro', 'symbols', 'emotion', 'life'];
  const currentStepIndex = steps.indexOf(state.metadata.form_step);


  // const currentStepIndex = steps.indexOf('symbols');
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];
  const isLastStep = currentStepIndex === steps.length - 1;





  if(state.metadata.dream_id === "") {
    dispatch({type:'SET_DREAM_ID', payload: dreamID})
  }

// console.log(currentStepIndex);
// console.log('State inputs', state.symbols);

//!for testing
  useEffect(()=>{
    // dispatch({
    //   type: 'SET_SYMBOLS_INTERPRETED',
    //   payload: testSymbols,
    // })
    // dispatch({
    //   type: 'SET_DREAM_TEXT',
    //   payload: fakeDream,
    // })
  },[])


  const handleFindSymbols = async (dream: string) => {
    console.log('dream:', dream);
    setIsLoading(true)
    if(state.metadata.form_step === 'intro') {
      console.log('made it past here', state.metadata.form_step);
      if(!userId){
        console.warn("User ID is not available.")
        return
      }
      
      try {
        const response = await analyzeDream({
          userId: userId,
          dreamId: dreamID,
          step: 0,
          inputData: {
            dream: state.inputs.dream_text
          }
        })

        const arrayMatch = await response.match(/\[(.*?)\]/s);
        // let parsedArray: string[] = [];
        let parsedArray: { symbol: string; meaning: string }[] = [];

        if(arrayMatch) {
          try {
            parsedArray = JSON.parse(arrayMatch[0])

            const formatted = parsedArray.map((symbolObj) => ({
              symbol:symbolObj.symbol,
              meaning: symbolObj.meaning,
              isEditing: false,
            }))

            dispatch({
              type: 'SET_SYMBOLS_INTERPRETED',
              payload: formatted,
            })
          } catch (err) {
            console.error('❌ Failed to parse symbols JSON:', err)
          }
        } else {
          console.warn('⚠️ No JSON block found in response.');
        }
      } catch (error) {
        console.warn('error with finding symbols in dream', error);
      }
    }
    setIsLoading(false)
  }


 
  return (
    // <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.exitButton}
      >
        <Ionicons name="arrow-back" style={styles.arrowBack}/>
        <Text style={styles.stepBackText}>Salir</Text>
      </TouchableOpacity>

        {currentStepIndex !== 1 ? (
            inputFields
              .filter(field => field.step === currentStepIndex)
              .map((field) =>  (
           <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{String(field.placeholder)}</Text>
              <TextInput
                key={field.key}
                style={[styles.input, field.multiline && styles.textArea]}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa" 
                value={state.inputs[field.key]}
                onChangeText={(text) =>
                  dispatch({
                    type: keyToInputActionType[field.key], 
                    payload: text
                  })
                }
                multiline={field.multiline}
                textAlignVertical={field.multiline ? 'top' : 'center'}
              />
            </View>
          </ScrollView>
          ))        
        ):(
          <View style={styles.container}>
            <Loading loading={isLoading}/>

          <Text style={styles.labelSymbolsScreen}>Estos son los simbolos que hemos detectado de tu sueño</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={80} 
          >
          <ScrollView 
            contentContainerStyle={styles.scrollContainerSymbols} 
            keyboardShouldPersistTaps="handled"
            >

              {/* This is symbols and meaning */}
            {state.symbols.symbols_interpreted.map((entry, index) =>  (
            <View key={index} style={styles.inputContainer}>
              {/* <Text style={styles.label}>{entry.symbol}</Text> */}
              <View style={styles.symbolRow}>
                <Text style={styles.label}>{entry.symbol}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    const updated = [...state.symbols.symbols_interpreted];
                    updated[index] = { ...entry, isEditing: !entry.isEditing };
                    dispatch({
                      type: 'SET_SYMBOLS_INTERPRETED',
                      payload: updated,
                    });
                  }}
                >
                  <Text style={styles.editButtonText}>
                    {entry.isEditing ? 'Done' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Meaning input */}
              <TextInput
                style={entry.isEditing ? styles.inputEditing : styles.input}
                textAlignVertical="top"
                multiline
                value={entry.meaning}
                editable={entry.isEditing}
                onChangeText={(text) => {
                  const updated = [...state.symbols.symbols_interpreted];
                  updated[index] = {...entry, meaning: text};
                  dispatch({
                    type: 'SET_SYMBOLS_INTERPRETED',
                    payload: updated,
                  });
                }}
              />
            </View>
            ))}
          </ScrollView>
          </KeyboardAvoidingView>
          </View>
        )}
        <View style={styles.navButtonsContainer}>
          {currentStepIndex !== 0 ? (
            <TouchableOpacity style={[styles.stepBack, { flex: 1 }]} 
            onPress={() => {
              dispatch({type: 'SET_FORM_STEP', payload: prevStep })
            }}
            >
              <Text style={styles.stepBackText}>Atrás</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1}} />
          )}

          <TouchableOpacity style={[styles.submitButton, { flex: 1, alignSelf: 'flex-end' }]} 
          onPress={() => {
            if(!isLastStep){
              if(state.metadata.form_step === 'intro'){            
              handleFindSymbols(state.inputs.dream_text)
              }
              dispatch({type: 'SET_FORM_STEP', payload: nextStep})
            } else {
              onSubmit(state)
            }
          }}>
            <Text>{!isLastStep? 'Siguiente' : 'Enviar sueño'}</Text>
          </TouchableOpacity>    
       </View>
      </View>
    // </ScrollView>
  )
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    padding: 16,
    backgroundColor: '#2c2c2e',
  },
  scrollContainerSymbols: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#2c2c2e',
  },
  container: {
    flex: 1,
    backgroundColor: '#2c2c2e',
    position: 'relative',
  },
  inputContainer: {
    flex: 1, // ✅ NEW: allow inputs to share height
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#f0f0f0',
  },
  labelSymbolsScreen: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 25,
    color: '#f0f0f0',
  },
  symbolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    flex: 1, // ✅ NEW: makes input fill container
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#2c2c2e',
    color: '#fff',
    minHeight: 48, // ✅ ensures base height even for single-line input
  },
  inputEditing: {
    flex: 1, // ✅ NEW: makes input fill container
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#3a3a3c',
    color: '#fff',
    minHeight: 48,
  },
  textArea: {
    minHeight: 100, // ✅ retains your original intent
  },
  navButtonsContainer: {
    flexDirection: 'row',          // 🔄 Align buttons horizontally
    justifyContent: 'space-between', // ↔️ Spread them out
    alignItems: 'center',          // 🧍 Vertical alignment
    marginTop: 24,
  }, 
  submitButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },  
  submitButtonText: {
    color: '#1c1c1e',
    fontWeight: 'bold',
    fontSize: 16,
  }, 
  stepBack: {
    backgroundColor: 'transparent', 
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
  }, 
  stepBackText: {
    color: '#fff', // 🖤 Dark text
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowBack: {
    fontSize: 18,
    color:"#fff",
  },
  exitButton: {
    position: 'absolute',
    top: -3,
    right: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default DreamContentForm