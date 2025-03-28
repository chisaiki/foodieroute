import { useEffect, useRef } from "react";
import "../styles/tailwindStyle.css";

type SearchBoxViewProps = {
  setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  triggerSearch: () => void;
};

const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


// This is for autocomplete, 
// It gets attacted as a script then can be called from anywhere from home.
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places`;
script.async = true;
script.defer = true;
document.body.appendChild(script);



declare global {
  interface Window {
    initMap: () => void;
  }
}

declare const google: any;

export default function SearchBoxView({
  // origin, 
  setOrigin,
  // dest, 
  setDest,
  searchQuery, 
  setSearchQuery,
  triggerSearch
}: SearchBoxViewProps) {
  const originRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google) return;

    const originAutocomplete = new google.maps.places.Autocomplete(originRef.current!, {
      types: ["geocode"],
    });

    const destAutocomplete = new google.maps.places.Autocomplete(destRef.current!, {
      types: ["geocode"],
    });

    originAutocomplete.addListener("place_changed", () => {
      const place = originAutocomplete.getPlace();
      if (place.geometry) {
        setOrigin({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    destAutocomplete.addListener("place_changed", () => {
      const place = destAutocomplete.getPlace();
      if (place.geometry) {
        setDest({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  }, []);

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
      onClick={triggerSearch}>
      Search
    </button>
    </div>
  );
}
