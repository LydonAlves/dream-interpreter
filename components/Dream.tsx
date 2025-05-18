import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Dream } from '@/types/dream';
import { useDreams } from '@/context/DreamContext';
import TextComponent from './TextComponent';
import SymbolsComponent from './SymbolsComponent';


const DreamComponent = () => {
  const [dream, setDream] = useState<Dream | undefined>()
  const router = useRouter()
  const {id} = useLocalSearchParams<{id:string}>()
  const {dreams} = useDreams()

  
  // useEffect(()=>{
  //   for (const key in dream) {
  //     if (Object.prototype.hasOwnProperty.call(dream, key)) {
  //       console.log(key);
  //     }
  //   }
  //   console.log(dream?.symbols);
    
  // },[dream])
  

  useEffect(() => {
    const selectedDream = dreams.find((dream) => dream.dream_id === id )
    setDream(selectedDream)
  },[id])
  // console.log("dreams", dreams);
  // console.log("selected dream", dream);
  // console.log("dreamId", id);
  
  return (
    <>
      <Stack.Screen options={{headerShown: false}} />

            <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name='close-outline' size={28}  style={styles.closeButton}/>
            </TouchableOpacity>

              {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{dream?.title}</Text>
              <Text style={styles.date}>{new Date(Number(dream?.date) * 1000).toLocaleDateString('en-GB')}</Text>
            </View>
            {dream && (
              <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                >
                <TextComponent title="Sueño" textToShow={dream?.dream_text} />
                <TextComponent title="Emoción" textToShow={dream?.emotion} />
                <TextComponent title="Momento vital" textToShow={dream?.context} />
                <TextComponent title="Interpretación final" textToShow={dream?.finalInterpretation} />
                <SymbolsComponent title='Symbols' symbols={dream?.symbols}/>
              </ScrollView>
            )}

            {/* <Text style={styles.dream_text}>{dream?.dream_text}</Text>
            <Text style={styles.aiText}>{dream?.finalInterpretation}</Text> */}
          </View>
    </>
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, 
    backgroundColor: '#2c2c2e', 
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    color: '#f0f0f0', 
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0f0f0', 
  },
  date: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  dream_text: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
  },
  aiText: {
    fontSize: 16,
    color: '#bbb',
    fontStyle: 'italic',
    marginTop: 24,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  symbolsContainer: {
    paddingVertical: 8,
  },
  symbolRow: {
    marginBottom: 6,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '500',
  },
  meaningText: {
    fontSize: 14,
    marginLeft: 12,
    color: '#555',
  },
  aiInfoContainer: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },
  contentContainer: {
    padding: 16,           
    paddingBottom: 32,     
  },
});


export default DreamComponent


