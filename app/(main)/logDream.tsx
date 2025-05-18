//! The for the uuidv4 to work in react native you need to have the previous import
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import DreamContentForm from "@/components/DreamContentForm"
import { DreamInfoState } from "@/reducers/DreamInfoReducer"
import ResultsScreen from "@/components/ResultsScreen"
import { ResultsState } from "@/reducers/ResultsScreenReducer"
import { analyzeDream } from "@/lib/dreamService"
import { useAuth } from "@clerk/clerk-expo"
import { useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"
import Loading from '@/components/Loading';



// const testChatAnswer = "Your dream reveals a deep longing for change and transformation. The symbols you encountered — whether they appeared as people, places, or strange occurrences — represent hidden parts of your subconscious reaching out for attention. Flying may indicate a desire to escape limitations, while unfamiliar faces could signify aspects of yourself you're still discovering. The emotional tone of the dream suggests that you're navigating a period of inner growth, possibly confronting fears or doubts that have held you back. Ultimately, this dream points to a journey inward — a call to trust your instincts, embrace uncertainty, and move forward with courage and clarity."
// const step3Answer = "Okay, I see what you’re saying now — that makes a lot more sense after your explanation. I appreciate the detailed feedback, it really helped clarify things for me. Based on what you pointed out, I went ahead and adjusted what I originally said to better align with your suggestions."
// const finalAnswer = "step 4 As we conclude this process of dream exploration, it's clear that your dreams have served as a rich, symbolic landscape reflecting your inner world — your fears, desires, unresolved tensions, and deep intuitions. Throughout this journey, we've seen recurring themes, symbolic patterns, and emotional narratives that point toward meaningful areas in your life, both conscious and unconscious."

//! Save the dream to the database once it is done.



const dream = () => {
  const [step, setStep] = useState(1)
  const [response, setResponse] = useState('')
  const { userId } = useAuth();
  if(!userId) return null;
  const [dreamId] = useState(() => uuidv4());
  const [isLoading, setIsLoading] = useState(false)


  // useEffect(() => {
  //   console.log('current step', step);
  //   console.log('result', result);

  //   if(step === 3) {
  //     setResponse(step3Answer)
  //   } else if(step === 4) {
  //     setResponse(finalAnswer)
  //   } 
    
  // },[step])

  //* this handles step 1
  const handleSubmitDream = async (formData: DreamInfoState) => {
    // console.log('Dream info state', formData);
    setIsLoading(true)

    //! here an api will be called, the below won't be necessary
    // setDream(formData.dream_text);

    // setTimeout(() => {
    //   setResponse(testChatAnswer)
    //   setStep(2)
    // }, 2000)

    //? set this up from data that is in DreamInfoState
    try {
      const response = await analyzeDream({
        userId,
        dreamId: formData.metadata.dream_id,
        step: 1,
        inputData: {
          title: formData.inputs.dream_title,
          dream: formData.inputs.dream_text,
          symbols: formData.symbols.symbols_interpreted.map(({symbol, meaning}) => ({
            symbol,
            meaning,
          })) ,
          emotion: formData.inputs.emotion,
          context: formData.inputs.current_life,
        }   
        //!for testing  
        // inputData: {
        //   title: "La Casa Inundada",
        //   dream: "Estoy en la casa donde crecí, pero está abandonada y deteriorada. Empieza a llover torrencialmente, y de pronto el agua comienza a filtrarse por las ventanas y a subir desde el suelo. Trato de correr de una habitación a otra, pero cada una está más llena de agua que la anterior. Encuentro una foto antigua de mi familia flotando, la agarro y me trepo a una mesa. La casa cruje, parece que va a colapsar. Justo cuando el agua me llega al cuello, me despierto.",
        //   symbols: [
        //     { symbol: "casa", meaning: "Representa el yo interior o la mente; el estado de la casa refleja tu estado emocional actual." },
        //     { symbol: "agua", meaning: "Simbólica de emociones y del subconsciente; el agua turbulenta puede indicar ansiedad o cambios emocionales." },
        //     { symbol: "ventanas", meaning: "Una apertura a nuevas perspectivas o una forma de ver el mundo exterior; puede significar esperanza o introspección." },
        //     { symbol: "foto antigua", meaning: "Conexión con el pasado o nostalgia; puede reflejar recuerdos, raíces o aspectos no resueltos de tu historia personal." },
        //     { symbol: "familia", meaning: "Representa la seguridad, las relaciones fundamentales y tu sentido de pertenencia o responsabilidad emocional." },
        //     { symbol: "mesa", meaning: "Símbolo de estabilidad, comunidad y diálogo; puede representar la necesidad de apoyo o conexión." },
        //     { symbol: "deterioro", meaning: "Sentimientos de pérdida, decadencia o miedo a que algo importante se esté desmoronando en tu vida." },
        //     { symbol: "colapso", meaning: "Ansiedad frente a cambios extremos o al descontrol; refleja miedo al fracaso o a la pérdida de estructura." }
        //   ],
        //   emotion: "Angustia, nostalgia, miedo, deseo de proteger",
        //   context: "Estoy atravesando una etapa de muchos cambios: una mudanza a otra ciudad, el cierre de un ciclo personal, y la sensación de estar dejando atrás una parte importante de mí. Siento incertidumbre sobre el futuro y nostalgia por lo que ya no volverá."
        // }
      });
      console.log(typeof response);
      console.log("response", response);      
      
      

      // if (response && typeof response.response === 'string') {
      //   setResponse(response.response);
      //   console.log("Ai Response", response);
      // } else {
      //   console.error("Unexpected response:", response);
      // }
      setResponse(response)
      setStep(2)
    } catch (error) {
      console.error("Error analyzing dream:", error);
    }  
    setIsLoading(false)
  } 

  //* in Results Screen set up a button that is automatically "No", if they click on 
  //* "Yes" then a text box opens to allow them to add more info
  const handleAiResults = async (formData: ResultsState) => {
    setIsLoading(true)
    // console.log('AI results', formData);
    if(step === 2){
      try {
        const response = await analyzeDream({
          userId,
          dreamId: dreamId,
          step: 2,
          inputData: {
            resonated: formData.resonate,
            disagreed: formData.disagree,
          }    
          //! for testing
          // inputData: {
          //   resonated: "La imagen de la foto flotando en el agua realmente resonó conmigo — se sintió como tratar de aferrarse a partes de la identidad o la familia durante momentos emocionales abrumadores.",
          //   disagreed: "No me identifiqué del todo con que la casa estuviera abandonada o deteriorada. Mi hogar de la infancia se siente más como una fuente de fortaleza que como algo que se está desmoronando."
          // }
        });
        console.log("second response", response);
        
        setResponse(response)
        setStep(3)
      } catch (error) {
        console.error("Error analyzing dream:", error);
      }

    } else if (step === 3 ) {
      
      try {
        const response = await analyzeDream({
          userId: "user123",
          dreamId: "dream123",
          step: 3,
          inputData: {
            goal: formData.improve
          }  
          //! for testing 
          // inputData: {
          //   goal: "Estoy intentando sentirme más cómodo con la incertidumbre y el cambio, especialmente al dejar atrás entornos o rutinas familiares."
          // }
        });
        console.log("response 3", response);
        
        setResponse(response)
        setStep(4)
      } catch (error) {
        console.error("Error analyzing dream:", error);
      }
    }
    setIsLoading(false)
    // setTimeout(() => {
    //   step === 2 ? setStep(3) : setStep(4)
    //   console.log('step', step);     
    // }, 2000)  
  }
 
  return(
    <View style={{flex: 1, position: 'relative'}}>
      <Loading loading={isLoading}/>
      { step === 1 && ( <DreamContentForm step={step} onSubmit={handleSubmitDream} dreamID={dreamId} /> )}
      { step !== 1 && (
        <ResultsScreen step={step} text={response} onSubmit={handleAiResults} /> 
        )}
    </View>
  )
  
}




export default dream