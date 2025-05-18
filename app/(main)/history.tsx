
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDreams } from '@/context/DreamContext';
import { Ionicons } from '@expo/vector-icons';

// export const dreams: Dream[] = [
//   {
//     id: '1',
//     title: 'Flying Over Cities',
//     date: '2025-03-23',
//     dream_text: 'I flew across rooftops with ease, feeling the wind under my arms like wings.',
//     AIText: 'Flying in dreams often represents a desire for freedom or escape. You may be feeling empowered and in control of your life right now.'
//   },
//   {
//     id: '2',
//     title: 'Ocean Voyage',
//     date: '2025-03-20',
//     dream_text: 'I was on a ship in the middle of a storm, yet I felt calm as the waves crashed around me.',
//     AIText: 'Sailing through a storm suggests emotional turbulence. Your calmness might indicate inner strength and resilience in tough times.'
//   },
//   {
//     id: '3',
//     title: 'Talking Cat',
//     date: '2025-03-18',
//     dream_text: 'My cat started talking and gave me life advice while sipping tea.',
//     AIText: 'Talking animals often symbolize hidden wisdom. The cat may represent your intuition trying to guide you through a situation.'
//   },
//   {
//     id: '4',
//     title: 'Endless Staircase',
//     date: '2025-03-15',
//     dream_text: 'I kept climbing a spiral staircase that never ended, passing doors I didn’t dare open.',
//     AIText: 'An endless staircase can symbolize a personal journey or struggle. The unopened doors might reflect missed opportunities or fears.'
//   },
//   {
//     id: '5',
//     title: 'Forest of Lights',
//     date: '2025-03-12',
//     dream_text: 'I wandered through a glowing forest where the trees whispered secrets to me.',
//     AIText: 'A glowing forest signifies mystery and wonder. The whispering trees could be urging you to pay attention to your subconscious thoughts.'
//   },
//   {
//     id: '6',
//     title: 'Time Travel Classroom',
//     date: '2025-03-10',
//     dream_text: 'I was back in school, but every subject took me to a different era in time.',
//     AIText: 'Time travel in a classroom might point to lessons from your past shaping your present. It’s a sign of reflection and growth.'
//   },
//   {
//     id: '7',
//     title: 'Underwater City',
//     date: '2025-03-08',
//     dream_text: 'I discovered a beautiful city under the sea where people floated instead of walking.',
//     AIText: 'An underwater city reflects your deep emotions. Floating instead of walking suggests a need to let go and flow with life.'
//   },
//   {
//     id: '8',
//     title: 'Mirror World',
//     date: '2025-03-06',
//     dream_text: 'I entered a mirror and found a world where everything was slightly backwards and off.',
//     AIText: 'Mirrors in dreams often symbolize self-examination. This backwards world may represent how you perceive yourself vs. how others do.'
//   },
//   {
//     id: '9',
//     title: 'Stranger with My Face',
//     date: '2025-03-04',
//     dream_text: 'I saw someone who looked exactly like me, but they didn’t recognize me.',
//     AIText: 'Seeing your double may suggest an identity crisis or self-reflection. You might be exploring hidden or forgotten parts of yourself.'
//   },
//   {
//     id: '10',
//     title: 'Desert Train',
//     date: '2025-03-01',
//     dream_text: 'I was riding an old train through a desert, chasing a red moon on the horizon.',
//     AIText: 'Trains often represent a journey or direction in life. The desert may signify isolation, while the red moon could hint at deep desires or passion.'
//   }
// ];

//! This is where I need to start by setting up fetch dreams
 
const History = () => {
  const router = useRouter()
  const {dreams} = useDreams()

  const sortedDreams = dreams.sort((a, b) => {
   return new Date(b.date).getTime() - new Date(a.date).getTime()
  })


  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name='arrow-back' size={28}  style={styles.closeButton}/>
      </TouchableOpacity>

      <ScrollView style={styles.screen}>
          <View style={styles.container}>
            {sortedDreams.map((dream) => (
                <TouchableOpacity
                  key={dream.dream_id}
                  onPress={() => router.push(`/(dream)/${dream.dream_id}`)}
                  style={styles.dreamItem}
                >
                
                    <View style={styles.dreamHeader}>
                    <Text style={styles.title}>{dream.title}</Text>
                    <Text style={styles.date}>{new Date(Number(dream.date) * 1000).toLocaleDateString('en-GB')}</Text>
                    </View>
                    <Text style={styles.text}>{dream.dream_text}</Text>
                
                </TouchableOpacity>
            ))}
          </View>  
      </ScrollView>
    </View>  
  )
}

export default History

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative', 
    backgroundColor: '#2c2c2e',
  },
  screen: {
    // flex: 1,
    backgroundColor: '#2c2c2e', 
    marginTop: 60,
  },
  container: {
    marginTop: 10,
    padding: 16,
  },
  dreamItem: {
    backgroundColor: '#3a3a3c', 
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f0f0f0', // Light text
    flex: 1,
    paddingRight: 8,
  },
  date: {
    color: '#aaa',
    fontSize: 13,
  },
  text: {
    fontSize: 15,
    color: '#ccc',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    color: '#f0f0f0', 
  },
});
