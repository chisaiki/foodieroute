import HomeView from "../views/HomeView";
import { useEffect, useState } from "react";
import { Places } from "../../../types/types";
//import { useDispatch, useSelector } from "react-redux";

function HomeContainer() {

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

    // const [places, setPlaces] = useState<Places[]>([]);

    return (
      <HomeView 
      places={places}
      setPlaces={setPlaces}
      origin={origin}
      setOrigin={setOrigin}
      
      />
    );

}

export default HomeContainer;

