import NavigationButtons from "./NavigationButtons";
import ListView from "./List";
import MapErrorView from "./MapError";
import MapView from "./Map";
import SearchBoxView from "./SearchBox";

import { Places } from "../../../types/types";

import "../styles/tailwindStyle.css"

type HomeViewProps = {
  places: Places[];
  setPlaces: React.Dispatch<React.SetStateAction<Places[]>>;
  origin: { lat: number; lng: number };
  setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  dest: { lat: number; lng: number };
  setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  

  apiGMapsKey: string;
  apiGPlaceskey: string;


  searchRequested: boolean;
  setSearchRequested: React.Dispatch<React.SetStateAction<boolean>>;
  triggerSearch: () => void;
};

export default function HomeView({ 
  places, setPlaces, 
  origin, setOrigin, 
  dest, setDest,
  searchQuery, setSearchQuery,
  apiGMapsKey, 
  apiGPlaceskey,

  searchRequested,
  setSearchRequested,
  triggerSearch

}: HomeViewProps) {

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
          <MapView mapsapiKey = {apiGMapsKey} placesAPIKey={apiGPlaceskey} origin={origin} setPlaces={setPlaces} ></MapView>

          {/* <MapView
            mapsapiKey={apiGMapsKey}
            placesAPIKey={apiGPlaceskey}
            origin={origin}
            dest={dest}
            searchQuery={searchQuery}
            setPlaces={setPlaces}
            searchRequested={searchRequested}
            setSearchRequested={setSearchRequested}>
          </MapView> */}
          
          {/* <MapErrorView></MapErrorView> */}
        </div>
        <div className="mainGridThree">
        <SearchBoxView
          setOrigin={setOrigin}
          setDest={setDest}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          triggerSearch={triggerSearch}
        />
        </div>

      </div>
    </div>

  </div>

);
}