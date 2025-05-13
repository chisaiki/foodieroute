/* HomeView – main layout with navigation bar, sidebar, map, and search controls */

import React, { useState } from "react";

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
  return (
    // Use flex layout to stack navigation on top of main content
    <div className="flex flex-col h-screen">

      {/* Navigation bar at the top */}
      <NavigationButtons />

      {/* Main area is a two-column grid: sidebar + map */}
        <div
        className={`flex flex-col lg:grid overflow-hidden flex-1 transition-all duration-300 ${
        isSidebarCollapsed
        ? 'lg:grid-cols-[0_1fr]'
        : 'lg:grid-cols-[300px_1fr]'
        }`}
        >




        {/* Left column: list of search results */}
            {/* Toggle Button – absolutely positioned over the map area */}
        <button
          className="absolute top-20 left-2 z-20 text-sm bg-white border px-2 py-1 rounded shadow hover:bg-gray-100"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          {isSidebarCollapsed ? 'Show List' : 'Hide List'}
        </button>

        {/* Left column: collapsible sidebar */}
        <aside
        className={`bg-pink-200 transition-all duration-300 overflow-y-auto ${
        isSidebarCollapsed
        ? 'max-h-0 lg:max-h-full lg:w-0 p-0 overflow-hidden'
        : 'max-h-[33vh] lg:h-full lg:max-h-full lg:w-full p-4'
        }`}
        >
        {!isSidebarCollapsed && (
        <ListView
        places={places}
        selectedPlaceName={selectedPlaceName}
        onSelect={(name) =>
        setSelectedPlaceName((prev) => (prev === name ? null : name))
        }
        />
        )}
        </aside>






        {/* Right column: map and search controls */}
        <section className="flex flex-col flex-1 min-h-0">
          <MapView mapRef={mapRef} selectedPlaceName={selectedPlaceName} />

            <div
            className={`transition-all duration-300 overflow-hidden ${
            isSearchCollapsed ? 'max-h-12 p-2' : 'max-h-[500px] p-4'
            } bg-indigo-50`}
            >
            <div className="flex justify-end">
            <button
            className="text-sm text-gray-700 hover:underline mb-2"
            onClick={() => setIsSearchCollapsed((prev) => !prev)}
            >
            {isSearchCollapsed ? 'Show Search Controls' : 'Hide Search Controls'}
            </button>
            </div>

            <div className={`transition-opacity duration-300 ${isSearchCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
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


        </section>
      </div>
    </div>
  );
}
