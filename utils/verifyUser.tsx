
import { backendLink } from './backendLink';

export const syncUserToBackend = async (token: string | null) => {
  if (!token) {
    console.warn("No token available.");
    return;
  }
  // console.log("syncUser working");
  // console.log("token:", token);
  
  try {

    const res = await fetch(`${backendLink}/auth/sync`, { 
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      console.warn("❌ Backend sync failed:", msg);
    } else {
      console.log("✅ User synced to backend");
    }
  } catch (error) {
    console.error("❌ Error syncing user:", error);
  }
};
