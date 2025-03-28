import HomeView from "../views/HomeView";
import { useEffect, useState } from "react";
import { Places } from "../../../types/types";
import { LoadScript } from '@react-google-maps/api';




// const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


// // This is for autocomplete, 
// // It gets attacted as a script then can be called from anywhere from home.
// const script = document.createElement("script");
// script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places`;
// script.async = true;
// script.defer = true;
// document.body.appendChild(script);


function HomeContainer() {
  const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={['places', 'geometry']}>
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
    </LoadScript>
  );

}

export default HomeContainer;

