import NavigationButtons from "./NavigationButtons";
import ListView from "./List";
import MapErrorView from "./MapError";
import MapView from "./Map";
import SearchBoxView from "./SearchBox";


import "../styles/tailwindStyle.css"

export default function HomeView(){
  const googleMapsAPIKey : string = "placeholder";
  const googleplacesAPIkey: string = "placeholder";

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
          <MapView mapsapiKey = {googleMapsAPIKey} placesAPIKey={googleplacesAPIkey}  ></MapView>
          {/* <MapErrorView></MapErrorView> */}
        </div>
        <div className="mainGridThree">
          <SearchBoxView></SearchBoxView>
        </div>

      </div>
    </div>

  </div>

);
}