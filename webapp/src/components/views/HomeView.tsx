import NavigationButtons from "./NavigationButtons";
import ListView from "./list";
import MapView from "./Map";
import SearchBoxView from "./SearchBox";
import "../styles/tailwindStyle.css"

export default function HomeView()
{
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
          <MapView></MapView>
        </div>
        <div className="mainGridThree">
          <SearchBoxView></SearchBoxView>
        </div>

      </div>
    </div>

  </div>

);
}