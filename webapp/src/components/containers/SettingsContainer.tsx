import SettingsView from "../views/Settings";

import { useEffect, useState } from "react";
import { useAuth } from "../../config/AuthUser"; 
import { updateUserVegetarianStatus, updateUserHalalStatus, updateUserVeganStatus } from '../../config/AuthUser';
import { useNavigate } from 'react-router-dom';


function SettingsContainer() {

  const navigate = useNavigate();
  const { userData, updateUserData } = useAuth();
  console.log("printing frontend user data ",userData); // 
  const [isVegi, setIsVegi] = useState<boolean>(userData?.vegetarian ?? false); // Tracking state
  const [isHalal, setIsHalal]   = useState<boolean>(userData?.halal ?? false);
  const [isVegan, setIsVegan]   = useState<boolean>(userData?.vegan   ?? false);
  // Update this whenever we add a new user field 
  useEffect(() => {
    if (userData){
      setIsVegi(userData.vegetarian ?? false)
      setIsHalal(userData.halal ?? false);
      setIsVegan(userData.vegan ?? false);
    
    }
  }, [userData])



  const userId = userData?.uid ?? ""; 

  const toggleVegetarian = async () => {
    console.log("Toggling Vegi");

    if (!userId) return; 

    const success = await updateUserVegetarianStatus(userId, !isVegi);
    if (success) {
      setIsVegi(!isVegi);
      // Update the frontend userData
      if (userData) {
        updateUserData({ ...userData, vegetarian: !isVegi });
      }
    }
  };

    const toggleHalal = async () => {
    if (!userId || !userData) return;
    const ok = await updateUserHalalStatus(userId, !isHalal);
    if (ok) {
      setIsHalal(!isHalal);
      updateUserData({ ...userData, halal: !isHalal });
    }
  };

  const toggleVegan = async () => {
    if (!userId || !userData) return;
    const ok = await updateUserVeganStatus(userId, !isVegan);
    if (ok) {
      setIsVegan(!isVegan);
      updateUserData({ ...userData, vegan: !isVegan });
    }
  };

  const handleHistoryClick = (historyItem: any) => {
    // Navigate to home with the history item data
    navigate('/', { state: { historyItem } });
  };

  return (
    <SettingsView 
      veg={isVegi}  
      toggleVeg={toggleVegetarian} 
      halal={isHalal}
      toggleHalal={toggleHalal}
      vegan={isVegan}
      toggleVegan={toggleVegan}
      history={userData?.history ?? []} 
      onHistoryClick={handleHistoryClick}
    />
  );
}

export default SettingsContainer;

