import { useAuth } from "@clerk/clerk-expo";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFonts } from 'expo-font';
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


SplashScreen.preventAutoHideAsync()


const InitialLayout = () =>{
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf')
  })

  const {isLoaded, isSignedIn} = useAuth()
  const segments = useSegments()
  const router = useRouter()
  
  useEffect(()=>{
  if (error) throw error;
  },[error])

  useEffect(()=>{
    if(loaded){
      SplashScreen.hideAsync()
    }
  },[loaded])

  //* This redirects me to another page if the user is signed in
  useEffect(()=>{
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    console.log('segments:', segments);

    if(!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
        router.replace('../(main)');
      // console.log("user signed in");
      // router.replace('/(auth)/login');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/login');
    }

  },[isLoaded, isSignedIn, segments])

  if(!loaded || !isLoaded){
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size='large' color='#000'/>
    </View>
  }

  return(
    <Stack>
      <Stack.Screen
      name='index'
      options={{
        headerShown: false,
      }}
      />

      <Stack.Screen
      name="login"
      options={{
        presentation: 'modal',
        title: '',
        headerLeft: ()=> (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-outline" size={28}/>
          </TouchableOpacity>
        )
      }}
      />
    </Stack>
  )
}



const  RootLayoutNav = () => {
  return (
       <InitialLayout/>
  )
}

export default RootLayoutNav