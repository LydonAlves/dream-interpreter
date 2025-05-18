import { DreamProvider } from '@/context/DreamContext'
import { Slot } from 'expo-router'
import React from 'react'
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider } from '@clerk/clerk-expo';
import SettingsProvider from '@/context/SettingsContext';


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

const _layout = () => {
  // console.log('Clerk key:', CLERK_PUBLISHABLE_KEY);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SettingsProvider>
        <DreamProvider>
          <Slot/>
        </DreamProvider>
      </SettingsProvider>
    </ClerkProvider>
  )
}

export default _layout