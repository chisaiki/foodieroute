import SettingsView from "../views/Settings";
import { useEffect, useState } from "react";
import { useAuth } from "../../config/AuthUser"; 
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

function SettingsContainer() {
  
  const { userData } = useAuth();
  console.log("printing frontend user data ",userData); // 

  //let isVegi = userData?.vegetarian ?? false;
  const [isVegi, setIsVegi] = useState<boolean>(userData?.vegetarian ?? false); // Tracking state

  const userId = userData?.uid ?? ""; 


  const toggleVegetarian = async () => {
    console.log("Toggleing Vegi");

    if (!userId) return; // Prevent errors if no user is logged in

    try { // Update doc 
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { vegetarian: !isVegi }); 
      setIsVegi(!isVegi);// changes user data on the frontend 
    } catch (error) {
      console.error("Error updating vegetarian status:", error);
    }
  };




    return (
      <SettingsView veg = {isVegi}  toggleVeg={toggleVegetarian} />
    );

}

export default SettingsContainer;

