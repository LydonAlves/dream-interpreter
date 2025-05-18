import { Dream } from '@/types/dream';
import { backendLink } from '@/utils/backendLink';

export const fetchDreamsWithAuth = async (userId: string, token: string): Promise<Dream[]> => {

  try {
    const res = await fetch(`${backendLink}/dreams/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if(!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data: Dream[] = await res.json();
    // console.log("dream data", data);
    
    return data;

  } catch (error) {
    console.error('Fetch fialed:', error)
    return [];
  }
}