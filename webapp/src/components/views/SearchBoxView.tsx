import { useEffect, useRef, useState } from "react";
import "../styles/tailwindStyle.css";

type SearchBoxViewProps = {
  setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  setDest: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  triggerSearch: () => void;
};

const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google: any;
  }
}

export default function SearchBoxView({
  setOrigin,
  setDest,
  searchQuery,
  setSearchQuery,
  triggerSearch,
}: SearchBoxViewProps) {
  const originRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps?.places) {
      initializeAutocomplete();
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setScriptLoaded(true);
      initializeAutocomplete();
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script.");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!originRef.current || !destRef.current || !window.google) return;

    const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current);
    const destAutocomplete = new window.google.maps.places.Autocomplete(destRef.current);

    originAutocomplete.addListener("place_changed", () => {
      const place = originAutocomplete.getPlace();
      if (place && place.geometry) {
        setOrigin({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    destAutocomplete.addListener("place_changed", () => {
      const place = destAutocomplete.getPlace();
      if (place && place.geometry) {
        setDest({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  };

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
        disabled={!scriptLoaded}
      >
        Search
      </button>
    </div>
  );
}