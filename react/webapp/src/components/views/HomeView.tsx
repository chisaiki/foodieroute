import NavigationButtons from "./NavigationButtons";
import ListView from "./List";
import MapErrorView from "./MapError";
import MapView from "./MapView";
import SearchBoxView from "./SearchBoxView";

import { Place } from "../../../types/types";

import "../styles/tailwindStyle.css"

type HomeViewProps = {
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  origin: { lat: number; lng: number };
  // setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  dest: { lat: number; lng: number };
  // setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  

  apiGMapsKey: string;
  apiGPlaceskey: string;


  searchRequested: boolean;
  setSearchRequested: React.Dispatch<React.SetStateAction<boolean>>;
  triggerSearch: () => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  originRef: React.RefObject<HTMLInputElement| null>;
  destRef: React.RefObject<HTMLInputElement| null>;
};

export default function HomeView({ 
  places, setPlaces, 
  origin, //setOrigin, 
  dest, //setDest,
  searchQuery, setSearchQuery,
  apiGMapsKey, 
  apiGPlaceskey,

  searchRequested,
  setSearchRequested,
  triggerSearch,

  mapRef,
  originRef,
  destRef,

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
          <ListView places={places}></ListView>
        </div>
        <div className="mainGridTwo">
          <MapView mapRef={mapRef} ></MapView>

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
          // setOrigin={setOrigin}
          // setDest={setDest}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          triggerSearch={triggerSearch}
          originRef={originRef}
          destRef={destRef}
        />
        </div>

      </div>
    </div>

  </div>

);
}