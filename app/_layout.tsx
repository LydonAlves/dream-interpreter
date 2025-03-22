import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
import { useFonts } from 'expo-font';
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

SplashScreen.preventAutoHideAsync()


const InitialLayout = () =>{
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
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
    if(!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';

    if(isSignedIn && !inAuthGroup){
      router.replace('/(auth)/chatPage')
    } else if (!isSignedIn){
      router.replace('../')
    }
  },[isSignedIn])

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

      <Stack.Screen name="(auth)" options={{headerShown: false}} />
    </Stack>
  )
}



const  RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <InitialLayout/>
    </ClerkProvider>
  )
}

export default RootLayoutNav