import HomeView from "../views/HomeView";
import { useEffect, useState } from "react";
import { Places } from "../../../types/types";
//import { useDispatch, useSelector } from "react-redux";


const googleMapsAPIKey : string = "AIzaSyBz6xP8Y0nDiMK_KVpAQnvjYv7SQxepoug";


// This is for autocomplete, 
// It gets attacted as a script then can be called from anywhere from home.
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places`;
script.async = true;
script.defer = true;
document.body.appendChild(script);


function HomeContainer() {

  // const googleplacesAPIkey: string = "";
    // const [isLoaded, setIsLoaded] = useState(false);

  // New Array of data type here
  const [places, setPlaces] = useState<Places[]>([]);

  const [origin, setOrigin] = useState<{ lat: number; lng: number }>({
    lat: 40.753742,
    lng: -73.983559,
  });
  const [dest, setDest] = useState<{ lat: number; lng: number }>({
    lat: 40.7505,
    lng: -73.9934,
  });

  const [searchQuery, setSearchQuery] = useState<string>("Pizza");

  const [searchRequested, setSearchRequested] = useState(false);
  const triggerSearch = () => {
    setSearchRequested(true);
  };


  // const [places, setPlaces] = useState<Places[]>([]);

  return (
  <HomeView
    places={places}
    setPlaces={setPlaces}
    origin={origin}
    setOrigin={setOrigin}
    dest={dest}
    setDest={setDest}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}

    apiGMapsKey={googleMapsAPIKey}
    apiGPlaceskey={googleMapsAPIKey}

    searchRequested={searchRequested}
    setSearchRequested={setSearchRequested}
    triggerSearch={triggerSearch}
  />
  );

}

export default HomeContainer;

