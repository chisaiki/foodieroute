import SettingsView from "../views/Settings";
import { useEffect, useState } from "react";
import { useAuth } from "../../config/AuthUser"; 
import { updateUserVegetarianStatus } from '../../config/AuthUser';

function SettingsContainer() {
  
  const { userData } = useAuth();
  console.log("printing frontend user data ",userData); // 
  const [isVegi, setIsVegi] = useState<boolean>(userData?.vegetarian ?? false); // Tracking state

  // Update this whenever we add a new user field 
  useEffect(() => {
    if (userData){
      setIsVegi(userData.vegetarian ?? false)
    }
  }, [userData])


  const userId = userData?.uid ?? ""; 


  const toggleVegetarian = async () => {
    console.log("Toggling Vegi");

    if (!userId) return; 

    const success = await updateUserVegetarianStatus(userId, !isVegi);
    if (success) {
      setIsVegi(!isVegi); 
    }
  };




    return (
      <SettingsView veg = {isVegi}  toggleVeg={toggleVegetarian} history={userData?.history ?? []} />
    );

}

export default SettingsContainer;

