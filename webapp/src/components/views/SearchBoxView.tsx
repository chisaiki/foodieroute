import { useEffect, useRef, useState } from "react";
import "../styles/tailwindStyle.css";

type SearchBoxViewProps = {
  // setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  // setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  triggerSearch: () => void;
  originRef: React.RefObject<HTMLInputElement | null>;
  destRef: React.RefObject<HTMLInputElement | null>;
  travelMode: google.maps.TravelMode;
  setTravelMode: React.Dispatch<React.SetStateAction<google.maps.TravelMode>>;
  sortMethod: "Rating" | "Price" | "Count";
  setSortMethod: React.Dispatch<
    React.SetStateAction<"Rating" | "Price" | "Count">
  >;
};

// const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google: any;
  }
}

export default function SearchBoxView({
  // setOrigin,
  // setDest,
  searchQuery,
  setSearchQuery,
  triggerSearch,
  originRef,
  destRef,
  travelMode,
  setTravelMode,
  sortMethod,
  setSortMethod
}: SearchBoxViewProps) {


  return (
    <div className="p-2 space-y-3">
      <div>
        <label>Origin:</label>
        <input
          ref={originRef}
          type="text"
          placeholder="Enter starting location"
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label>Destination:</label>
        <input
          ref={destRef}
          type="text"
          placeholder="Enter destination"
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label>Search Query (e.g. Pizza):</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label>Mode of Travel:</label>
        <select
          value={travelMode}
          onChange={(e) =>
            setTravelMode(e.target.value as google.maps.TravelMode)
          }
          className="border p-1 w-full"
        >
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="TRANSIT">Public Transit</option>
          <option value="BICYCLING">Bicycling</option>
        </select>
      </div>

      <div>
        <label>Sort places by:</label>
        <select
          value={sortMethod}
          onChange={(e) =>
            setSortMethod(e.target.value as "Rating" | "Price" | "Count")
          }
          className="border p-1 w-full mt-1"
        >
          <option value="Rating">Rating</option>
          <option value="Price">Price Level</option>
          <option value="Count">Review Count</option>
        </select>
      </div>

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={triggerSearch}
      //disable={true}
      >
        Search
      </button>
    </div>
  );
}
