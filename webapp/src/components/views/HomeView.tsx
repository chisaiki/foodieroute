import NavigationButtons from "./NavigationButtons";
import ListView from "./List";
import MapErrorView from "./MapError";
import MapView from "./Map";
import SearchBoxView from "./SearchBox";

import { Places } from "../../../types/types";

import "../styles/tailwindStyle.css"

type HomeViewProps = {
  places: Places[];
  setPlaces: React.Dispatch<React.SetStateAction<Places[]>>
  origin: { lat: number; lng: number };
  setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
};


export default function HomeView({ places,setPlaces, origin, setOrigin }: HomeViewProps) {
  const googleMapsAPIKey : string = "";
  const googleplacesAPIkey: string = "";

  //future plans
  //const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return(
  <div>
    <div className="temp-nav-bar">
        <NavigationButtons></NavigationButtons>
    </div>
    <div className="maingridwraper">

      <div className="maingrid"> 
        <div className="mainGridOne">
          <ListView></ListView>
        </div>
        <div className="mainGridTwo">
          <MapView mapsapiKey = {googleMapsAPIKey} placesAPIKey={googleplacesAPIkey} origin={origin} setPlaces={setPlaces} ></MapView>
          {/* <MapErrorView></MapErrorView> */}
        </div>
        <div className="mainGridThree">
        <SearchBoxView origin={origin} setOrigin={setOrigin} />
        </div>

      </div>
    </div>

  </div>

);
}