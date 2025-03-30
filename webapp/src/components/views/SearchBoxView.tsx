import { useEffect, useRef, useState } from "react";
import "../styles/tailwindStyle.css";

type SearchBoxViewProps = {
  // setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  // setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  triggerSearch: () => void;
  originRef: React.RefObject<HTMLInputElement | null >;
  destRef: React.RefObject<HTMLInputElement | null>;
};

const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
}: SearchBoxViewProps) {
  // const originRef = useRef<HTMLInputElement | null>(null);
  // const destRef = useRef<HTMLInputElement | null>(null);
  // const [scriptLoaded, setScriptLoaded] = useState(false);

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

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={triggerSearch}
        // disabled={true}
      >
        Search
      </button>
    </div>
  );
}