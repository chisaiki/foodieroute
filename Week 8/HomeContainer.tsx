import HomeView from "../views/HomeView";
import { useEffect, useRef, useState } from "react";
import { Place, PriceLevel } from "../../../types/types";
import {decodePlaces} from "../../../types/decoders";
// import { LoadScript } from '@react-google-maps/api';


  // TypeScript setup
  declare global {
    interface Window {
      initMap: () => void;
    }
  }

  declare const google: any;


function HomeContainer() {
  const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  // const [isLoaded, setIsLoaded] = useState(false);

    let SORT_METHOD = "Rating";

    interface PlacesResponse {
        places: Place[];
    }
  // New Array of data type here
  // const [places, setPlaces] = useState<Places[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  const [ORIGIN, setOrigin] = useState<{ lat: number; lng: number }>({
    lat: 40.753742,
    lng: -73.983559,
  });
  const [DESTINATION, setDest] = useState<{ lat: number; lng: number }>({
    lat: 40.7505,
    lng: -73.9934,
  });

  const [searchQuery, setSearchQuery] = useState<string>("Pizza");

  const [searchRequested, setSearchRequested] = useState(false);



  ///
  /// THE GOOGLE MAP LOGIC START 
  ///

  const [error, setError] = useState<string | null>(null);

  // Map related vars
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null); 
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);

  const TRAVEL_MODE = "DRIVING";
  const RADIUS = 200;
  const REDUCTION_CONSTANT = 50;

  const originRef = useRef<HTMLInputElement>(null); // Autocomplete listener
  const destRef = useRef<HTMLInputElement>(null); // Autocomplete listener

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places,geometry&callback=initMap`;
    // script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = () => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: ORIGIN,
        zoom: 15,
      });
      mapInstance.current = map; 
      //searchRoute(map);
    };

    script.onload = () => {
      initializeAutocomplete();
    };

    window.addEventListener("error", (event) => {
      if (event.message.includes("Google Maps JavaScript API error")) {
        setError("Google Maps API Error: Invalid or unauthorized API key.");
      }
    });

    // return () => {
    //   document.body.removeChild(script);
    // };
  }, [googleMapsAPIKey]);


    const searchRoute = (map: any) => {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({ map });
  
      directionsService.route(
        {
          origin: ORIGIN,
          destination: DESTINATION,
          travelMode: TRAVEL_MODE,
        },
        (response: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            const encodedPolyline = response.routes[0].overview_polyline;
            const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
  
            const coords = decodedPath.map((point: any) => [point.lat(), point.lng()]);
            const reduced = reduceCoordinates(coords);
            const midpoints = getCircleCenters(reduced);
            const locations: { lat: number; lng: number }[] = [];
            midpoints.forEach(([lat, lng]) => {
              const point = { lat, lng };
              locations.push(point); 
              // draw api call center
              // new google.maps.Marker({
              //   position: point,
              //   map,
              //   icon: {
              //     path: google.maps.SymbolPath.CIRCLE,
              //     fillColor: "blue",
              //     scale: 6,
              //   },
              // });
            });
            getSortedAndUniquePlaces(locations, map).then((finalPlaces) => {
              const myFinalPlaces = finalPlaces;
              
              // Bootleg decoder
              const decodedPlaces: Place[] = decodePlaces(finalPlaces);
              setPlaces(decodedPlaces);
              
              myFinalPlaces.forEach((place) => {
                //console.log(place.displayName);
                if (place.location) {
                  new google.maps.Marker({
                    position: {
                      lat: place.location.latitude,
                      lng: place.location.longitude,
                    },
                    map: map,
                    title: place.displayName?.text || 'Unnamed Place',
                  });
                }
              });

            });
            
          } else {
            console.error("Error with Directions API:", status);
          }        
        }
      );
    };
  
    async function getSortedAndUniquePlaces(locations: { lat: number; lng: number }[], map: google.maps.Map): Promise<any[]> {
      try {
        const allPlaces = await fetchAllNearbyPlaces(locations, map); // Fetch places from all locations
        const uniquePlaces = removeDuplicates(allPlaces); // Remove duplicates
        const sortedPlaces = sortPlaces(uniquePlaces); // Sort the places
        //console.log(sortedPlaces); // Optionally log the final result
        return sortedPlaces; // Return the final sorted and unique places
      } catch (error) {
        console.error("Error fetching or processing places:", error);
        return []; // Return an empty array if there's an error
      }
    }
  
    // if there are multiple mcdonalds, will only show one
    function removeDuplicates(places_array: any[]): any[] {
      // Use a Set to track unique displayName.text values
      const uniquePlaces: { lat: number; lng: number }[] = [];
      const seenNames = new Set();
  
      places_array.forEach((place) => {
          // Check if the place name has been seen before
          if (!seenNames.has(place.displayName.text)) {
              // If not, add to the unique places array and mark it as seen
              uniquePlaces.push(place);
              seenNames.add(place.displayName.text);
          }
      });
      return uniquePlaces;
  }
  
  function sortPlacesByRating(places_array: any[]): any[] {
    return places_array.sort((a, b) => b.rating - a.rating);
  }
  
  // Function to sort places by price level
  function sortPlacesByPriceLevel(places_array: Place[]): Place[] {
    //https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
    const priceLevelOrder: Record<PriceLevel, number> = {
        "PRICE_LEVEL_FREE": 1,
        "PRICE_LEVEL_INEXPENSIVE": 2,
        "PRICE_LEVEL_MODERATE": 3,
        "PRICE_LEVEL_EXPENSIVE": 4,
        "PRICE_LEVEL_VERY_EXPENSIVE": 5,
        "PRICE_LEVEL_UNSPECIFIED": 6,
    };
  
    return places_array.sort((a, b) => priceLevelOrder[a.priceLevel] - priceLevelOrder[b.priceLevel]);
  }
  
  // Function to sort places by user rating count (descending)
  function sortPlacesByUserRatingCount(places_array: any[]): any[] {
    return places_array.sort((a, b) => b.userRatingCount - a.userRatingCount);
  }
  
  function sortPlaces(places_array: any[]): any[] {
    switch (SORT_METHOD) {
        case "Price":
            places_array = sortPlacesByPriceLevel(places_array);
            break;
        case "Rating":
            places_array = sortPlacesByRating(places_array);
            break;
        case "Count":
            places_array = sortPlacesByUserRatingCount(places_array);
            break;
        default:
            console.log("Invalid sort method");
            break;
    }
  
    console.log("Places have been sorted by SORT_METHOD: " + SORT_METHOD);
    //console.log(places_array);
  
    return places_array;  // Return the sorted places array
  }
  
    async function fetchAllNearbyPlaces(locations: { lat: number; lng: number }[], map: any): Promise<Place[]> {
      const allPlaces: Place[] = [];
    
      for (const location of locations) {
        const places = await fetchNearbyPlaces(location, map);

        allPlaces.push(...places);  // Spread the places array into allPlaces
      }
    
      return allPlaces;
    }
  
  
  async function fetchNearbyPlaces(location: { lat: number; lng: number }, map: any): Promise<Place[]> {
    let places_return: Place[] = [];
    const url = `https://places.googleapis.com/v1/places:searchText?key=${googleMapsAPIKey}`;
  
    const LATITUDE_DEGREE_METERS = 111320;
    const LONGITUDE_DEGREE_METERS = 111320;
  
    const latChange = RADIUS / LATITUDE_DEGREE_METERS;
    const lonChange = RADIUS / (LONGITUDE_DEGREE_METERS * Math.cos(location.lat * (Math.PI / 180)));
  
    const lowLat = location.lat - latChange;
    const highLat = location.lat + latChange;
    const lowLng = location.lng - lonChange;
    const highLng = location.lng + lonChange;
  
    const bounds = {
        north: highLat,
        south: lowLat,
        east: highLng,
        west: lowLng
    };
    
    // draws the search area
    // const rectangle = new google.maps.Rectangle({
    //     map: map,
    //     bounds: bounds,
    //     fillColor: "#0000FF", // Semi-transparent blue
    //     fillOpacity: 0.1,
    //     strokeColor: "#0000FF", // Blue rectangle border
    //     strokeOpacity: 0.5,
    //     strokeWeight: 1
    // });
  
    const body = {
        "textQuery": searchQuery,
        "locationRestriction": {
            "rectangle": {
                "low": { "latitude": lowLat, "longitude": lowLng },
                "high": { "latitude": highLat, "longitude": highLng }
            }
        }
    };
  
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-FieldMask": [
                    "places.displayName",
                    "places.location",
                    "places.photos",
                    "places.rating",
                    "places.priceLevel",
                    "places.formattedAddress",
                    "places.userRatingCount",
                    "places.editorialSummary"
                ].join(",")
            },
            body: JSON.stringify(body)
        });
  
        const data: PlacesResponse = await response.json();
        places_return = data.places || []; // Ensure places_return is populated with places from the response
    } catch (error) {
        console.error('Error during fetch:', error);
    }
  
    return places_return; // Return the places array after the fetch completes
  }
  


  const metersToDegrees = (meters: number) => meters / 111320;

    const perpendicularDistance = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) =>
      Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    const reduceCoordinates = (coords: number[][]): number[][] => {
      const threshold = metersToDegrees(REDUCTION_CONSTANT);
      let i = 0;
      while (i < coords.length - 2) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        const [x3, y3] = coords[i + 2];
        const dist = perpendicularDistance(x2, y2, x1, y1, x3, y3);
        if (dist < threshold) {
          coords.splice(i + 1, 1);
        } else {
          i++;
        }
      }
      return coords;
    };

    const generatePointsAlongLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      radius: number = RADIUS
    ) => {
      const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const steps = Math.floor(dist / (2 * metersToDegrees(radius)));
      const dx = (x2 - x1) / dist;
      const dy = (y2 - y1) / dist;

      const points = [];
      for (let i = 0; i <= steps; i++) {
        points.push([x1 + i * 2 * metersToDegrees(radius) * dx, y1 + i * 2 * metersToDegrees(radius) * dy]);
      }
      return points;
    };

    const getCircleCenters = (reducedCoords: number[][]): number[][] => {
      const centers: number[][] = [];
      for (let i = 0; i < reducedCoords.length - 1; i++) {
        const [x1, y1] = reducedCoords[i];
        const [x2, y2] = reducedCoords[i + 1];
        centers.push(...generatePointsAlongLine(x1, y1, x2, y2));
      }
      return centers;
    };


    const initializeAutocomplete = () => {
      if (!originRef.current || !destRef.current || !window.google) return;
  
      const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current);
      const destAutocomplete = new window.google.maps.places.Autocomplete(destRef.current);
  
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
    };


  const triggerSearch = () => {
    console.log("Triggered Search");
    // Clear circle and markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    circlesRef.current.forEach((circle) => circle.setMap(null));
    circlesRef.current = [];

    // Clear previous route line
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Clear start/end markers
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
      endMarkerRef.current = null;
    }


    if (mapInstance.current) {
      searchRoute(mapInstance.current);
    } else {
      console.warn("Map not ready yet");
    }
  };

  ///
  /// THE GOOGLE MAP LOGIC ENDS 
  ///

  return (
    // <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={['places', 'geometry']}>
      <HomeView
        places={places}
        setPlaces={setPlaces}

        origin={ORIGIN}
        dest={DESTINATION}

        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        apiGMapsKey={googleMapsAPIKey}
        apiGPlaceskey={googleMapsAPIKey}
        searchRequested={searchRequested}
        setSearchRequested={setSearchRequested}
        triggerSearch={triggerSearch}
        
        mapRef = {mapRef}

        originRef={originRef}
        destRef={destRef}
        />
        
      );
    
    }

export default HomeContainer;

