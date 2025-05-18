
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite'
import type {SQLiteDatabase} from 'expo-sqlite'
import { fetchDreamsWithAuth } from '@/lib/fetchDreamhistory';
import { useAuth } from '@clerk/clerk-expo';
import { Dream } from '@/types/dream';


//! Ask ChatGPT how this code should be split up into different files
type DreamContextType = {
  dreams: Dream[];
  addDream: (dream: Dream) => void;
  deleteDream: (id: string) => void;
  clearDreams: () => void;
  isLoading: boolean
}

const DreamContext = createContext<DreamContextType | undefined>(undefined)


export const DreamProvider = ({children}: {children: ReactNode}) => {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const dbRef = useRef<SQLiteDatabase | null>(null);
  const {isLoaded ,isSignedIn, userId, getToken} = useAuth()

  const initDb = async () => {
    if (dbRef.current) return dbRef.current;

  const db =await SQLite.openDatabaseAsync('dreams.db')

  //? Execute one or more SQL statements in a batch
  //Be cautious about blocking too much work on the JS thread—if your schema grows or you add big migrations, consider the async API (openDatabaseAsync + execAsync) instead.
  db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS dreams (
      dream_id TEXT PRIMARY KEY NOT NULL,
      user_id   TEXT,
      title     TEXT,
      dream_text     TEXT,
      emotion   TEXT,
      context   TEXT,
      date      INTEGER,
      finalInterpretation TEXT
    );
  `);

   dbRef.current = db;
   return db;
  }

  useEffect(() =>{
    // console.log("isLoaded", isLoaded);
    // console.log("userId", userId);
    const loadAndSync= async () => {
      if(!isLoaded || !isSignedIn || !userId){
        console.log("Waiting for Clerk to load");
        return;        
      }

      try {
          const db = await initDb();
        // 1) Load from SQLite
        const local = await db.getAllAsync<Dream>(
          'SELECT * FROM dreams ORDER BY date DESC;'
        );
        setDreams(local)




        // 2) Fetch fresh from backend
        if(isLoaded && isSignedIn && userId) {
        const token = await getToken()

        if(token) {
          const fresh = await fetchDreamsWithAuth(userId, token);
          
          //bulk upsert
          for(const d of fresh) {
            await db.runAsync(
              `INSERT OR REPLACE INTO dreams
                 (dream_id, user_id, title, dream_text, emotion, context, date, finalInterpretation)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
             [
                d.dream_id,
                d.user_id,
                d.title,
                d.dream_text,
                d.emotion,
                d.context,
                d.date,
                d.finalInterpretation,
              ]
            )
          } 
          setDreams(fresh)
        }
       }   
      } catch (error) {
        console.error('Dream load/sync error', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAndSync()
  }, [isLoaded, isSignedIn, userId, getToken])

  // 3) context actions
  //? This could be used to add extra dreams indivually, not necessary for now
  const addDream = async (dream: Dream) => {
    const db = await initDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO dreams
         (dream_id, user_id, title, dream_text, emotion, context, date, finalInterpretation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        dream.dream_id,
        dream.user_id,
        dream.title,
        dream.dream_text,
        dream.emotion,
        dream.context,
        dream.date,
        dream.finalInterpretation,
      ]
    );
    setDreams((cur) => [dream, ...cur]);
  }

  //* Definately use, so user can delete dreams they don't want to keep
  const deleteDream = async (id: string) => {
    const db = await initDb();
    await db.runAsync('DELETE FROM dreams WHERE dream_id ?;', [id])
    setDreams((cur) => cur.filter(d => d.dream_id !== id))
  } 

  //! this clears all dreams
  const clearDreams =async () =>{
    const db = await initDb();
    await db.execAsync('DELETE FROM dreams;');
    setDreams([])
  }

  return(
    <DreamContext.Provider 
    value={{dreams, addDream, deleteDream, clearDreams, isLoading}}>
      {children}
    </DreamContext.Provider>
  )
  
 }

 export const useDreams = () => {
  const ctx = useContext(DreamContext)
  if(!ctx) throw new Error('useDreams must be used within DreamProvider')
  return ctx
 }