import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Dream } from '@/types/dream';
import { useDreams } from '@/context/DreamContext';
import { useAuth } from '@clerk/clerk-expo';


const MainDashboard = () => {
  const router = useRouter()
  const [latestDreams, setLatestDreams] = useState<Dream[]>([])
  const {dreams, isLoading} = useDreams()

   const { signOut } = useAuth();

   const onSignOutPress = async () => {
    try {
      await signOut();
      console.log("User signed out successfully.");
      router.replace('../(auth)');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };




  useEffect(() => {
    if(dreams?.length > 0){
    const dreamList = dreams.slice(0, 3)
    setLatestDreams(dreamList)
   }
  },[dreams])


   //? here I have flatlist that shows 3 dreams

  return (
    <View  style={styles.container}>
      <Text style={styles.title}>Bienvenido a tu Diario de Sueños</Text>
      <View style={styles.topButtonContainer}>
      <TouchableOpacity onPress={() => onSignOutPress()} style={styles.newDreamButton}>
          <Text style={styles.newDreamButtonText}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(main)/logDream')} style={styles.newDreamButton}>
          <Text style={styles.newDreamButtonText}>+ Nuevo sueño</Text>
        </TouchableOpacity>
      </View>
      

        <Text style={styles.subtitle}>Tus ùltimos sueños:</Text>
        {dreams?.length === 0 ? (
          <Text style={styles.placeholder}>No hay sueños guardados aùn.</Text>
         ) : (
          <FlatList
          data={dreams.slice(0, 3)}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={styles.dreamListContainer}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => router.push(`/(dream)/${item.dream_id}`)}>
            <View style={styles.dreamItem}>
                <View style={styles.dreamHeader}>
                  <Text style={styles.dreamTitle}>{item.title}</Text> 
                  <Text style={styles.dreamTitle}>{new Date(Number(item.date) * 1000).toLocaleDateString('en-GB')}</Text> 
                </View> 
                <Text style={styles.dreamText}>{item.dream_text}</Text>
             </View>
           </TouchableOpacity>
        )}
          />
        )}


         <View style={styles.bottomButtonContainer}>
          <TouchableOpacity onPress={() => router.push('/(main)/history')} style={styles.historyButton}>
            <Text style={styles.historyButtonText}>Ver historial completo</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default MainDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2e', // charcoal-like background
    padding: 16,
    paddingBottom: 60, // padding to make space for bottom button
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e6e6f0', // soft white tone
    marginBottom: 16,
  },
  topButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  newDreamButton: {
    backgroundColor: '#e0e0e0', // light grey
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  newDreamButtonText: {
    color: '#222', // dark text for contrast
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f0f0f0',
    marginVertical: 12,
  },
  placeholder: {
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
    marginTop: 12,
  },
  dreamListContainer: {
    paddingHorizontal: 12,
    backgroundColor: '#3a3a3c', // lighter than screen background
    borderRadius: 12,
    paddingVertical: 8,
  },
  dreamItem: {
    marginBottom: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: '#3a3a3c',
    // borderBottomColor: '#555',
    paddingBottom: 0,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dreamTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  dreamText: {
    fontSize: 14,
    height: 59,
    color: '#ccc',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  historyButton: {
  backgroundColor: '#e0e0e0', // soft light background
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignSelf: 'flex-start',
  },
  historyButtonText: {
    color: '#222', // dark text
    fontWeight: '600',
    fontSize: 14,
  },
});
