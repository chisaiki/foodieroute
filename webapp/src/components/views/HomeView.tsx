/* HomeView – main layout with navigation bar, sidebar, map, and search controls */

import React, { useState, useEffect } from "react";

import NavigationButtons from "./NavigationButtons";
import ListView from "./List";
import MapView from "./MapView";
import SearchBoxView from "./SearchBoxView";

import { Place } from "../../../types/types";

import "../styles/tailwindStyle.css";

type HomeViewProps = {
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;

  origin: { lat: number; lng: number };
  dest: { lat: number; lng: number };

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  apiGMapsKey: string;
  apiGPlaceskey: string;

  searchRequested: boolean;
  setSearchRequested: React.Dispatch<React.SetStateAction<boolean>>;
  triggerSearch: () => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  originRef: React.RefObject<HTMLInputElement | null>;
  destRef: React.RefObject<HTMLInputElement | null>;

  travelMode: google.maps.TravelMode;
  setTravelMode: React.Dispatch<
    React.SetStateAction<google.maps.TravelMode>
  >;

  sortMethod: "Rating" | "Price" | "Count";
  setSortMethod: React.Dispatch<
    React.SetStateAction<"Rating" | "Price" | "Count">
  >;

  selectedPlaceName: string | null;
  setSelectedPlaceName: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function HomeView({
  places,
  searchQuery,
  setSearchQuery,
  triggerSearch,
  mapRef,
  originRef,
  destRef,
  travelMode,
  setTravelMode,
  sortMethod,
  setSortMethod,
  selectedPlaceName,
  setSelectedPlaceName,
}: HomeViewProps) {


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (windowWidth <= 800) {
    return (
      <div>
      <div className="temp-nav-bar">
          <NavigationButtons></NavigationButtons>
      </div>
      <div className="maingridwraper">
  
        <div className="mainGrid"> 
            <div className="mainGridTwo">
              <MapView mapRef={mapRef} ></MapView>
            </div>

            <ListView
                places={places}
                selectedPlaceName={selectedPlaceName}
                // Clicking the same item again will deselect it
                onSelect={(name: string | null) =>
                  setSelectedPlaceName((prev) => (prev === name ? null : name))
                }
              />

            <div className="mainGridThree">
              <SearchBoxView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                triggerSearch={triggerSearch}
                originRef={originRef}
                destRef={destRef}
                travelMode={travelMode}
                setTravelMode={setTravelMode}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
                className="bg-indigo-50 p-4"
                selectedPlaceName={selectedPlaceName}
                setSelectedPlaceName={setSelectedPlaceName}
              />
            </div>


        </div>
      </div>
    </div>
    );
  } else {
    return (
      <div>
      <div className="temp-nav-bar">
          <NavigationButtons></NavigationButtons>
      </div>
      <div className="maingridwraper">
  
        <div className="mainGrid"> 
          <div className="mainGridOne">
            <ListView
              places={places}
              selectedPlaceName={selectedPlaceName}
              // Clicking the same item again will deselect it
              onSelect={(name: string | null) =>
                setSelectedPlaceName((prev) => (prev === name ? null : name))
              }
            />
          </div>
          <div className="mainGridTwo">
            <MapView mapRef={mapRef} ></MapView>

          </div>
          <div className="mainGridThree">
          <SearchBoxView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            triggerSearch={triggerSearch}
            originRef={originRef}
            destRef={destRef}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
            sortMethod={sortMethod}
            setSortMethod={setSortMethod}
            className="bg-indigo-50 p-4"

            // Keeps track of the selected place so map/list can highlight it
            selectedPlaceName={selectedPlaceName}
            setSelectedPlaceName={setSelectedPlaceName}
            />
            
          </div>
  
        </div>
      </div>
  
    </div>
    );
  }


}
