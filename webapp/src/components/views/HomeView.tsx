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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [desktopView, setDesktopView] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

    if (windowWidth<= 800 ){
      setDesktopView(false)
    }
  }, []);

// after your windowWidth‐tracking useEffect:
useEffect(() => {
  if (windowWidth <= 800 && isSidebarCollapsed) {
    setIsSidebarCollapsed(false);
  }
}, [windowWidth, isSidebarCollapsed]);



  const listDiv = () => {
    if (isSidebarCollapsed) {
      return (
        <div></div>
      )
    } else {
      return (
        <ListView
        places={places}
        selectedPlaceName={selectedPlaceName}
        onSelect={(name: string | null) =>
          setSelectedPlaceName((prev) => (prev === name ? null : name))
        }
      />
      )
    }
  }

  // if (windowWidth <= 800) { // Mobile Layout
  //   return (
  //     <div>
  //     <div className="temp-nav-bar">
  //         <NavigationButtons></NavigationButtons>
  //     </div>
  //     <div className="maingridwraper">
  
  //       <div className="mainGrid"> 
  //           <div className="mainGridTwo">
  //             <MapView mapRef={mapRef} ></MapView>
  //           </div>

  //           <ListView
  //               places={places}
  //               selectedPlaceName={selectedPlaceName}
  //               // Clicking the same item again will deselect it
  //               onSelect={(name: string | null) =>
  //                 setSelectedPlaceName((prev) => (prev === name ? null : name))
  //               }
  //             />

  //           <div className="mainGridThree">
  //             <SearchBoxView
  //               searchQuery={searchQuery}
  //               setSearchQuery={setSearchQuery}
  //               triggerSearch={triggerSearch}
  //               originRef={originRef}
  //               destRef={destRef}
  //               travelMode={travelMode}
  //               setTravelMode={setTravelMode}
  //               sortMethod={sortMethod}
  //               setSortMethod={setSortMethod}
  //               className="bg-indigo-50 p-4"
  //               selectedPlaceName={selectedPlaceName}
  //               setSelectedPlaceName={setSelectedPlaceName}
  //             />
  //           </div>


  //       </div>
  //     </div>
  //   </div>
  //   );
  // } else {  // Desktop Layout
    return (
      <div>

        <div className="temp-nav-bar">
          <NavigationButtons />
        </div>
        <div className="maingridwraper">
          <div className={`mainGrid ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className={`mainGridOne ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              {/* <div className="flex justify-end p-2">
                <button
                  className="text-sm text-gray-700 hover:underline"
                  onClick={() => setIsSidebarCollapsed(prev => !prev)}
                >
                  {isSidebarCollapsed ? 'Show List' : 'Hide List'}
                </button>
              </div> */}
              {windowWidth > 800 && (
                <div className="flex justify-end p-2">
                <button
                  className="text-sm text-gray-700 hover:underline"
                  onClick={() => setIsSidebarCollapsed(prev => !prev)}
                >
                  {isSidebarCollapsed ? 'Show List' : 'Hide List'}
                </button>
                </div>
            )}


              {listDiv()}
            </div>

            <div className="mainGridTwo">
              <MapView mapRef={mapRef} />
            </div>

            <div className={`mainGridThree transition-all duration-300 ${
              isSearchCollapsed ? 'max-h-12' : 'max-h-[500px]'
            }`}>
              {/* <div className="flex justify-end p-2">
                <button
                  className="text-sm text-gray-700 hover:underline"
                  onClick={() => setIsSearchCollapsed(prev => !prev)}
                >
                  {isSearchCollapsed ? 'Show Search Controls' : 'Hide Search Controls'}
                </button>
              </div> */}
              <div className="flex justify-end p-2">
              <button
                className="text-sm text-gray-700 hover:underline"
                onClick={() => setIsSearchCollapsed(prev => !prev)}
              >
                {windowWidth > 800
                  // desktop: classic “Hide/Show Search Controls”
                  ? (isSearchCollapsed ? 'Show Search Controls' : 'Hide Search Controls')
                  // mobile: when controls are open (isSearchCollapsed===false) → “Show List”
                  //         when controls are closed (isSearchCollapsed===true) → “Show Search Controls”
                  : (isSearchCollapsed ? 'Show Search Controls' : 'Show List')
                }
              </button>
            </div>


              
              <div className={`transition-opacity duration-300 ${
                isSearchCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'
              }`}>
                {!isSearchCollapsed && (
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
                    selectedPlaceName={selectedPlaceName}
                    setSelectedPlaceName={setSelectedPlaceName}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  //}
}
