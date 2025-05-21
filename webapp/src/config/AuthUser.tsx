import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Honestly I had chat gpd split this up from auth.tsx

// The user data we will pass around the app.
export interface UserData {
  uid: string;
  email: string;
  vegetarian: boolean;
  history: UserHistory[];
}

export interface UserHistory {          
  origin: {
    lat: number,
    lng: number,
  },
  destination: {
    lat: number,
    lng: number,
  },
  travelMode: string,
  origin_string: string,
  destination_string: string,
}



// Data that has the actual user auth
interface AuthContextType {
  userData: UserData | null;
  loading: boolean;
  updateUserData: (updatedUserData: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          const newUser: UserData = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            vegetarian: false,
            history: [],
          };
          await setDoc(userRef, newUser);
          setUserData(newUser);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = (updatedUserData: UserData) => {
    setUserData(updatedUserData);
  };

  return (
    <AuthContext.Provider value={{ userData, loading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access AuthContext, TY chat GPT
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


// Update the user data below
export const updateUserVegetarianStatus = async (userId: string, newStatus: boolean) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { vegetarian: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating vegetarian status:", error);
    return false;
  }
};

// Custom hook for updating user history
export const useUpdateHistory = () => {
  const { updateUserData } = useAuth();
  
  const updateHistory = async (
    userId: string,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    origin_string: string,
    destination_string: string,
    travelMode: string
  ) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error("User document not found");
        return false;
      }

      const userData = userDoc.data() as UserData;
      
      // Check if this search already exists in history
      const isDuplicate = userData.history.some(item => 
        item.origin_string === origin_string && 
        item.destination_string === destination_string
      );

      if (isDuplicate) {
        console.log("Search already exists in history, skipping...");
        return true;
      }

      const newHistory: UserHistory = {
        origin,
        destination,
        travelMode,
        origin_string,
        destination_string
      };

      // Add new history to the beginning of the array
      const updatedHistory = [newHistory, ...userData.history];
      const updatedUserData = { ...userData, history: updatedHistory };

      await updateDoc(userRef, {
        history: updatedHistory
      });

      // Update the frontend state
      updateUserData(updatedUserData);
      console.log("Successfully added search to history");
      return true;
    } catch (error) {
      console.error("Error adding search to history:", error);
      return false;
    }
  };

  return updateHistory;
};


export const appendSettingsToSearch = (userData: UserData | null) => {
  let return_str = "";

  if (userData?.vegetarian) {
    return_str += " vegetarian";
  }

  return return_str;
}