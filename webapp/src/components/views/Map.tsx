
import "../styles/tailwindStyle.css"
import MapErrorView from "./MapError";

import { useEffect, useRef, useState } from "react";

// I needed chatGPT for this
declare global {
  interface Window {
    initMap: () => void;
  }
}
declare const google: any;


export default function MapView( { mapsapiKey, placesAPIKey }: { mapsapiKey: string, placesAPIKey:string }) {
  const mapRef = useRef<HTMLDivElement | null>(null); 
  const [error, setError] = useState<string | null>(null); // State to track API errors

  useEffect(() => {

    // This shows the google maps api part
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsapiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // if there is an api change state
    // script.onerror = () => {
    //   console.log("IDK IS THIS WORKING?")
    //   setError("Failed to load Google Maps. Check your API key.");
    // };

    // Listen for API errors (including `InvalidKeyMapError`)
    const handleGoogleMapsError = (event: ErrorEvent) => {
      console.log("Is this even working?")
      if (event.message.includes("Google Maps JavaScript API error")) {
        setError("Google Maps API Error: Invalid or unauthorized API key.");
      }
    };

    // Attach error listener, maybe we need to add "warning"
    window.addEventListener("error", handleGoogleMapsError);
    // Not catching "VM1301 util.js:81 Google Maps JavaScript API warning: InvalidKey"

    window.initMap = () => {
      try {
        if (!mapRef.current) return;

        // Initial Map Setup
        const ORIGIN = { lat: 40.7648, lng: -73.9654 }; // Hunter College
        const RADIUS = 400; // in meters
        const SEARCH_QUERY = "Pizza"; // Searching for Pizza places
        const MAX_RESULT = 10; //max number of places shown per circle 
  
  
        const map = new google.maps.Map(mapRef.current, {
          zoom: 14,
          center: ORIGIN,
        });
  
        
        // addMarkersAndSearch(map);
      } catch (error){
        console.error("Google Maps initialization failed:", error);

        // The error view for whatever
        return (<MapErrorView></MapErrorView>)
      }

    };

    return () => {
      document.body.removeChild(script); 
      window.removeEventListener("error", handleGoogleMapsError);
    };
  }, [mapsapiKey, placesAPIKey]);

  // Function to add markers and fetch nearby places
  const addMarkersAndSearch = (map: any) => {
    const RADIUS = 400; // in meters
    const coords = [
      [40.76507, -73.96520000000001],
      [40.76205, -73.9633],
      [40.75864000000001, -73.96579000000001],
      [40.75175, -73.97081],
      [40.74443, -73.97614],
      [40.744730000000004, -73.98163000000001],
      [40.749590000000005, -73.99317],
    ];

    const service = new google.maps.places.PlacesService(map);


    // for (let j = 0; j < coords.length; j++) {
    //   let POINT = { lat: coords[j][0], lng: coords[j][1] };
      
    coords.forEach(([lat, lng]) => {
      const POINT = { lat, lng };

        // Add a marker for each point
        new google.maps.Marker({
        position: POINT,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "blue",
          fillOpacity: 1,
          strokeColor: "blue",
          strokeOpacity: 1,
          strokeWeight: 2,
          scale: 6,
        },
      });

      // Perform nearby search
      fetchNearbyPlaces(POINT, map);
    });
  };

  // Fetch nearby places using Google Places API
  const fetchNearbyPlaces = (location: { lat: number; lng: number }, map: any) => {
    const url = `https://places.googleapis.com/v1/places:searchText?key=${placesAPIKey}`;

    const LATITUDE_DEGREE_METERS = 111320;
    const LONGITUDE_DEGREE_METERS = 111320;

    const latChange = 400 / LATITUDE_DEGREE_METERS;
    const lonChange = 400 / (LONGITUDE_DEGREE_METERS * Math.cos(location.lat * (Math.PI / 180)));

    const lowLat = location.lat - latChange;
    const highLat = location.lat + latChange;
    const lowLng = location.lng - lonChange;
    const highLng = location.lng + lonChange;

    const body = {
      textQuery: "Pizza",
      locationRestriction: {
        rectangle: {
          low: { latitude: lowLat, longitude: lowLng },
          high: { latitude: highLat, longitude: highLng },
        },
      },
    };

    // Draw the rectangle on the map
    //   const rectangle = new google.maps.Rectangle({
    //     map: map,
    //     bounds: bounds,
    //     fillColor: "#0000FF", // Semi-transparent blue
    //     fillOpacity: 0.1,
    //     strokeColor: "#0000FF", // Blue rectangle border
    //     strokeOpacity: 0.5,
    //     strokeWeight: 1
    // });

    // const body = {
    //   "textQuery" : "Pizza",
    //   "locationRestriction": {
    //     "rectangle": {
    //       "low": {
    //         "latitude": lowLat,
    //         "longitude": lowLng
    //     },
    //     "high": {
    //         "latitude": highLat,
    //         "longitude": highLng
    //     }
    //     }
    //   }
    // };


    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.displayName,places.location",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.places) {
          data.places.forEach((place: any) => {
            if (place.location?.latitude && place.location?.longitude) {
              new google.maps.Marker({
                position: { lat: place.location.latitude, lng: place.location.longitude },
                map,
                title: place.displayName.text,
              });
            }
          });
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };

  // return <div></div>
  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}