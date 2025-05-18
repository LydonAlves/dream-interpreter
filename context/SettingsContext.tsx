import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import  AsyncStorage  from '@react-native-async-storage/async-storage';

type Settings = {
  userName: string | null;
  theme: 'light' | 'dark';
}

const DEFAULTS: Settings = {
  userName: null,
  theme: 'light',
};

export type SettingsContextType = {
  settings: Settings;
  setUserName: (name: string) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  clearSettings: () => Promise<void>;
  isLoading: boolean;
};


export const SettingsContext = createContext<
SettingsContextType | undefined
>(undefined)

interface SettingsProviderProps {
  children: ReactNode;
}


const SettingsProvider: FC<SettingsProviderProps> = ({ children }) =>  {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@myapp:settings')
        if (raw) setSettings(JSON.parse(raw))
      } catch (error) {
        console.warn('Failed to load settings', error)
      } finally {
        setIsLoading(false);
      }
    })()
  },[])

  const persist = async (updater: (prev: Settings) =>  Settings) => {
    setSettings(prev => {
    const next = updater(prev);
    AsyncStorage.setItem('@myapp:settings', JSON.stringify(next))
      .catch(err => console.warn('Failed to save settings', err));
    return next;
  });
  };

  const setUserName = async (name: string) => 
    persist(prev => ({ ...prev, userName: name }));

 const setTheme = async (theme: 'light' | 'dark') => 
    persist(prev => ({ ...prev, theme }));

  const clearSettings = async () => {
    await AsyncStorage.removeItem('@myapp:settings');
    setSettings(DEFAULTS);
  };

  const contextValue = useMemo(
    () => ({settings, setUserName, setTheme, clearSettings, isLoading}),
    [settings, isLoading]
  )

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};