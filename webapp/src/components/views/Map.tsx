
import "../styles/tailwindStyle.css"

import { useEffect, useRef } from "react";

// I needed chatGPT for this
declare global {
  interface Window {
    initMap: () => void;
  }
}
declare const google: any;


export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null); // ✅ Create a ref for the map container

  useEffect(() => {
    // ✅ Load Google Maps script dynamically
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // ✅ Define initMap globally (needed for Google callback)
    window.initMap = () => {
      if (!mapRef.current) return;

      // Initial Map Setup
      const ORIGIN = { lat: 40.7648, lng: -73.9654 }; // Hunter College

      const map = new google.maps.Map(mapRef.current, {
        zoom: 14,
        center: ORIGIN,
      });

      // ✅ Call function to add markers & search
      addMarkersAndSearch(map);
    };

    return () => {
      document.body.removeChild(script); // ✅ Cleanup script when component unmounts
    };
  }, []);

  // ✅ Function to add markers and fetch nearby places
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

    coords.forEach(([lat, lng]) => {
      const POINT = { lat, lng };

      // ✅ Add a marker for each point
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

      // ✅ Perform nearby search
      fetchNearbyPlaces(POINT, map);
    });
  };

  // ✅ Fetch nearby places using Google Places API
  const fetchNearbyPlaces = (location: { lat: number; lng: number }, map: any) => {
    const url = `https://places.googleapis.com/v1/places:searchText?key=YOUR_API_KEY`;

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

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}