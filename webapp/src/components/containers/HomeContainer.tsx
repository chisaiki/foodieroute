import HomeView from "../views/HomeView";
import { useEffect, useRef, useState } from "react";
import { Place, PriceLevel } from "../../../types/types";
import { decodePlaces } from "../../../types/decoders";
import { useAuth, useUpdateHistory, appendSettingsToSearch } from '../../config/AuthUser';
import { useLocation } from 'react-router-dom';

// Declare global Google Maps interface used by script loader
declare global {
  interface Window {
    initMap: () => void;
  }
}

declare const google: any;

function HomeContainer() {
  // Reference to the currently open InfoWindow on the map
  const activeInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Get Google Maps API key from environment variables
  const googleMapsAPIKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  // Get current user data from authentication context
  const { userData } = useAuth();
  const updateHistory = useUpdateHistory();
  const location = useLocation(); // For history page

  // Current sorting method for results
  const [sortMethod, setSortMethod] = useState<"Rating" | "Price" | "Count">("Rating");

  // Type for decoded Places API responses
  interface PlacesResponse {
    places: Place[];
  }

  // List of places found from the API
  const [places, setPlaces] = useState<Place[]>([]);

  // Coordinates for the starting and ending points of the route
  const [ORIGIN, setOrigin] = useState<{ lat: number; lng: number }>({
    lat: 40.753742,
    lng: -73.983559,
  });
  const [DESTINATION, setDest] = useState<{ lat: number; lng: number }>({
    lat: 40.7505,
    lng: -73.9934,
  });

  //states made to determine if input entered by user is valid, aka a given address is derived from google autocomplete
  const [originValid, setOriginValid] = useState(false);
  const [destinationValid, setDestinationValid] = useState(false);

  // Text input for origin and destination (used in search history)
  const [origin_string, setOrigin_string] = useState<string>("");
  const [destination_string, setDestination_string] = useState<string>("");

  // Keyword for the type of place to search (e.g. "Pizza", "Bakery")
  const [searchQuery, setSearchQuery] = useState<string>("Pizza");

  // Whether the user has clicked the search button
  const [searchRequested, setSearchRequested] = useState(false);

  ///
  /// THE GOOGLE MAP LOGIC START 
  ///

  // Optional error state for displaying issues like an invalid API key
  const [error, setError] = useState<string | null>(null);

  // Map container reference
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Actual Google Map instance
  const mapInstance = useRef<any>(null);

  // Keep track of all markers and overlays added to the map
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  // Track colored polylines so we can clear them next search
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // References for displaying and clearing route directions
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const boundsListRef = useRef<google.maps.LatLngBoundsLiteral[]>([]);
  // just under the other useState hooks
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    "DRIVING" as google.maps.TravelMode
  );

  //helper function for marker display when not selected
  const defaultMarkerIcon = (): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8, // Slightly larger
    fillColor: "#4285F4", // Google blue
    fillOpacity: 1,
    strokeColor: "#ffffff", // White outline
    strokeWeight: 2, // Thicker border
  });

  //helper function for marker display when selected
  const selectedMarkerIcon = (): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10, // Larger circle
    fillColor: "#DB4437", // Google red
    fillOpacity: 1,
    strokeColor: "#ffffff", // White outline
    strokeWeight: 3, // Thicker border
  });

  // Name of the currently selected place from the sidebar
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);

  // Store all markers by place name for later reference
  const placeMarkersRef = useRef<Record<string, google.maps.Marker>>({});

  // Handle history item data from navigation
  useEffect(() => {
    const historyItem = location.state?.historyItem;
    if (historyItem) {
      console.log("History item found");
      console.log(historyItem);
      setOrigin(historyItem.origin);
      setDest(historyItem.destination);
      setOrigin_string(historyItem.origin_string);
      setDestination_string(historyItem.destination_string);

      // Use a single useEffect to trigger search after all state updates
      // This timeout is used to ensure that the search is triggered after all state updates
      const timer = setTimeout(() => {
        if (origin_string === historyItem.origin_string &&
          destination_string === historyItem.destination_string) {
          triggerSearch();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.state, origin_string, destination_string]);


  useEffect(() => {
    if (typeof google === "undefined" || !google.maps) return;

    // Reset all markers to default style
    Object.values(placeMarkersRef.current).forEach((marker) => {
      marker.setIcon(defaultMarkerIcon());
      marker.setZIndex(undefined);
    });

    if (!selectedPlaceName) {
      activeInfoWindowRef.current?.close();
      return;
    }

    const marker = placeMarkersRef.current[selectedPlaceName];
    if (marker) {
      marker.setIcon(selectedMarkerIcon());
      marker.setZIndex(9999);
      google.maps.event.trigger(marker, "click"); // open its InfoWindow
    }
  }, [selectedPlaceName]);

  // the default search radius in meters and also the coordinate reduction const
  const RADIUS = 200;
  const REDUCTION_CONSTANT = 50;

  // Input refs used for autocomplete setup
  const originRef = useRef<HTMLInputElement>(null); // Autocomplete listener
  const destRef = useRef<HTMLInputElement>(null); // Autocomplete listener

  // Load Google Maps API and initialize the map and autocomplete
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

  // Choose black or white text based on background color brightness
  const contrastText = (hex: string) => {
    // strip number and convert to RGB
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    // brightness lvl formula
    const brightness_level = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (brightness_level > 0.5)
      return "#000000";
    return "#FFFFFF";
  };

  // Draw transparent blue rectangles around search sample points
  const drawSearchRectangles = (
    locs: { lat: number; lng: number }[],
    map: google.maps.Map
  ) => {
    const LAT_METERS = 111_320;
    const RADIUS_M = travelMode === "WALKING" ? 100 : RADIUS; // uses existing constant

    boundsListRef.current = []; //clear previous

    locs.forEach(({ lat, lng }) => {
      const latDelta = RADIUS_M / LAT_METERS;
      const lonDelta = RADIUS_M / (LAT_METERS * Math.cos(lat * (Math.PI / 180)));

      const bounds: google.maps.LatLngBoundsLiteral = {
        north: lat + latDelta,
        south: lat - latDelta,
        east: lng + lonDelta,
        west: lng - lonDelta,
      };

      boundsListRef.current.push(bounds);

      // const rect = new google.maps.Rectangle({
      //   map,
      //   bounds,
      //   fillColor: "#0000FF",
      //   fillOpacity: 0.1,
      //   strokeColor: "#0000FF",
      //   strokeOpacity: 0.5,
      //   strokeWeight: 1,
      // });

      // circlesRef.current.push(rect as unknown as google.maps.Circle);
    });
  };

  // essentially just handles map clearing, route fetching, marker drawing, and place display
  const searchRoute = (map: google.maps.Map) => {

    console.log(ORIGIN.lat + ' and ' + ORIGIN.lng);
    console.log(DESTINATION.lat + ' and ' + DESTINATION.lng);
    console.log("searchRoute called");
    // Clear previously stored place markers
    placeMarkersRef.current = {};

    // remove any existing polylines from the map
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // Close the currently open info window, if any
    if (activeInfoWindowRef.current) {
      activeInfoWindowRef.current.close();
      activeInfoWindowRef.current = null;
    }

    // Remove directions renderer if already on the map
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    // Remove all existing markers and circles from the map
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    // Create new direction service and renderer for route drawing
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer =
      directionsRendererRef.current ?? new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRendererRef.current = directionsRenderer;

    // Hide default route line if user selects public transit
    if (travelMode === "TRANSIT") {
      directionsRenderer.setOptions({
        polylineOptions: { strokeOpacity: 0 },
      });
    }

    // Fetch route from Google Directions API
    directionsService.route(
      {
        origin: ORIGIN,
        destination: DESTINATION,
        travelMode,
      },
      async (response: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const distanceInMeters = response.routes[0]?.legs[0]?.distance?.value || 0;
          const distanceInMiles = distanceInMeters / 1609.34;

          if (distanceInMiles > 3) {
            alert("The selected route is over 3 miles.");
            return; // Stop further execution
          }
          // For driving, walking, or biking, just show the route as-is
          if (travelMode !== "TRANSIT") {
            directionsRenderer.setDirections(response);
          } else {
            // For transit routes, draw custom polylines and transit badges
            const legs = response.routes[0].legs;
            legs.forEach((leg: any) => {
              leg.steps.forEach((step: any) => {
                const stepPath = google.maps.geometry.encoding.decodePath(
                  step.polyline.points
                );

                // Set default color for walking segments
                let color = "#808080";

                // Use the agency's color for transit steps if available
                if (step.travel_mode === "TRANSIT" && step.transit) {
                  color = step.transit.line.color || "#3366FF";
                }

                // Draw the polyline for this step
                const poly = new google.maps.Polyline({
                  path: stepPath,
                  strokeColor: color,
                  strokeOpacity: 1,
                  strokeWeight: 6,
                  map,
                });
                polylinesRef.current.push(poly);

                // Add a circular badge at the start of each transit step
                if (step.travel_mode === "TRANSIT" && step.transit) {
                  let label = "";

                  // Get the short or full name of the transit line
                  if (step.transit.line.short_name) {
                    label = step.transit.line.short_name;
                  } else if (step.transit.line.name) {
                    label = step.transit.line.name;
                  }

                  // Format the label to be short, capitalized, and readable
                  label = label.trim();
                  const lower = label.toLowerCase();
                  if (lower.endsWith(" line")) {
                    label = label.slice(0, -5);
                  } else if (lower.endsWith("line")) {
                    label = label.slice(0, -4);
                  }
                  label = label.trim().toUpperCase();
                  label = label.split(" ")[0];
                  if (label.length > 4) {
                    label = label.slice(0, 4);
                  }

                  const shortName = label || "N/A";

                  // Place the badge on the map
                  const badge = new google.maps.Marker({
                    position: step.start_location,
                    map,
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: color,
                      fillOpacity: 1,
                      strokeColor: "#FFFFFF",
                      strokeWeight: 1,
                      scale: 10,
                    },
                    label: {
                      text: shortName,
                      color: contrastText(color),
                      fontWeight: "bold",
                    },
                    zIndex: 9999,
                  });
                  markersRef.current.push(badge);
                }
              });
            });
          }

          // Generate points along the route for further place search
          const encodedPolyline = response.routes[0].overview_polyline;
          const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
          const coords = decodedPath.map((p: any) => [p.lat(), p.lng()]);
          const isWalking = travelMode === "WALKING";
          const processedCoords = isWalking ? coords : reduceCoordinates(coords);
          const midpoints = isWalking
            ? generateWalkingMidpoints(processedCoords)
            : getCircleCenters(processedCoords);
          const locations: { lat: number; lng: number }[] = [];

          // Add a small marker at each midpoint
          midpoints.forEach(([lat, lng]) => {
            const pos = { lat, lng };
            locations.push(pos);

            // const m = new google.maps.Marker({
            //   position: pos,
            //   map,
            //   icon: {
            //     path: google.maps.SymbolPath.CIRCLE,
            //     fillColor: "blue",
            //     scale: 6,
            //   },
            // });
            // markersRef.current.push(m);
          });

          // Draw rectangular areas around the midpoints to show search zones
          drawSearchRectangles(locations, map);

          // Save this search to user history if signed in
          if (userData?.uid && origin_string !== "" && destination_string !== "") {
            const success = await updateHistory(
              userData.uid,
              ORIGIN,
              DESTINATION,
              origin_string,
              destination_string,
              travelMode
            );
            if (success) {
              console.log("Successfully saved search to history");
            } else {
              console.log("Failed to save search to history");
            }
          } else {
            console.log("No user data found");
          }

          try {
            // Fetch nearby places and remove duplicates
            const finalPlaces = await getSortedAndUniquePlaces(locations, map);
            const decodedPlaces: Place[] = decodePlaces(finalPlaces);
            setPlaces(decodedPlaces);

            // Place markers and InfoWindows for each result
            finalPlaces.forEach((place) => {
              if (!place.location) return;

              const marker = new google.maps.Marker({
                position: {
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                },
                map,
                title: place.displayName?.text || 'Unnamed Place',
                icon: defaultMarkerIcon(),
              });

              if (place.displayName?.text) {
                placeMarkersRef.current[place.displayName.text] = marker;
              }
              markersRef.current.push(marker);

              const infoWindow = new google.maps.InfoWindow({
                content: `<div style="max-width:300px;"><p>Loading...</p></div>`,
              });


              // When the marker is clicked, fetch photo and show updated info
              let selectedMarker: google.maps.Marker | null = null;

              marker.addListener("click", async () => {
                if (activeInfoWindowRef.current) {
                  activeInfoWindowRef.current.close();
                }

                Object.values(placeMarkersRef.current).forEach((m) => {
                  m.setIcon(defaultMarkerIcon());
                  m.setZIndex(undefined);
                });

                // Highlight the clicked marker
                marker.setIcon(selectedMarkerIcon());
                marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                selectedMarker = marker;

                let photoHtml = '<p>No photo available.</p>';
                const firstPhoto = place.photos?.[0];

                //photo API call
                if (firstPhoto?.name) {
                  const photoUrl = `https://places.googleapis.com/v1/${firstPhoto.name}/media?maxWidthPx=400&key=${googleMapsAPIKey}`;
                  photoHtml = `<img src="${photoUrl}" style="max-width:250px; max-height:150px; object-fit:cover; border-radius:4px;" />`;
                }

                // …inside your marker click handler…
                const content = `
                  <div class="info-window-content" style="max-width:300px;">
                    <h3>${place.displayName?.text || 'Unnamed Place'}</h3>
                    ${photoHtml}
                    <p>${place.formattedAddress || ''}</p>
                  </div>
                `;
                infoWindow.setContent(content);

                infoWindow.open(map, marker);
                activeInfoWindowRef.current = infoWindow;
              });
            });


          } catch (err) {
            console.error("Error processing places ", err);
          }
        } else {
          console.error("Error with Directions API:", status);
        }
      }
    );
  };

  // Fetches places near each location, removes duplicates, and sorts them
  async function getSortedAndUniquePlaces(locations: { lat: number; lng: number }[], map: google.maps.Map): Promise<any[]> {
    console.log("getSortedAndUniquePlaces called");
    try {
      // Retrieve all places from the list of locations, then filter them and sort them afterwards
      const allPlaces = await fetchAllNearbyPlaces(locations, map);
      const uniquePlaces = removeDuplicates(allPlaces);
      const filtered = uniquePlaces.filter((p) => {
        const lat = p.location?.latitude;
        const lng = p.location?.longitude;
        return lat !== undefined && lng !== undefined && isInAnyBounds(lat, lng);
      });
      return sortPlaces(filtered);
    } catch (error) {
      // if anything goes wrong during the process for whatever reason, simply return an empty list
      console.error("Error fetching or processing places:", error);
      return [];
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

  function isInAnyBounds(lat: number, lng: number): boolean {
    return boundsListRef.current.some((bounds) => (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    ));
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

  function sortPlaces(arr: any[]) {
    switch (sortMethod) {  // <-- use state
      case "Price": return sortPlacesByPriceLevel(arr);
      case "Count": return sortPlacesByUserRatingCount(arr);
      default: return sortPlacesByRating(arr);
    }
  }

  //modify fetchAllNearbyPlaces so that we await all Promises
  //this ensures the markers are displayed almost instantaneously
  async function fetchAllNearbyPlaces(
    locations: { lat: number; lng: number }[],
    map: google.maps.Map
  ): Promise<Place[]> {
    // console.log("fetchAllNearbyPlaces called");
    // launch all fetches simultaneously for performance increase
    const results = await Promise.all(
      locations.map((loc) => fetchNearbyPlaces(loc, map))
    );

    // flatten 2D array to 1D
    return results.flat();
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


    const modifiedSearchQuery = appendSettingsToSearch(userData);
    const modifiedSearchQuery2 = searchQuery + modifiedSearchQuery;
    console.log("Search Query: " + searchQuery);
    console.log("Modified Search Query: " + modifiedSearchQuery2);

    const body = {

      "textQuery": modifiedSearchQuery2,
      "locationRestriction": {
        "rectangle": {
          "low": { latitude: lowLat, longitude: lowLng },
          "high": { latitude: highLat, longitude: highLng }
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
      const rawPlaces = data.places || [];

      // Filter out places outside the rectangle
      places_return = rawPlaces.filter((place) => {
        const lat = place.location?.latitude;
        const lng = place.location?.longitude;
        return (
          lat !== undefined &&
          lng !== undefined &&
          lat >= lowLat &&
          lat <= highLat &&
          lng >= lowLng &&
          lng <= highLng
        );
      });

    } catch (error) {
      console.error('Error during fetch:', error);
    }

    return places_return;
  }


  const metersToDegrees = (meters: number) => meters / 111320;

  //helper function for walking mode of travel
  function generateWalkingMidpoints(path: number[][]): number[][] {
    const minDistanceMeters = 400;
    const minDistanceDegrees = metersToDegrees(minDistanceMeters);

    const points: number[][] = [];
    let lastLat = path[0][0];
    let lastLng = path[0][1];
    points.push([lastLat, lastLng]);

    let accumulatedDist = 0;

    for (let i = 1; i < path.length; i++) {
      const [currLat, currLng] = path[i];
      const dist = Math.sqrt(
        Math.pow(currLat - lastLat, 2) + Math.pow(currLng - lastLng, 2)
      );
      accumulatedDist += dist;

      if (accumulatedDist >= minDistanceDegrees) {
        points.push([currLat, currLng]);
        lastLat = currLat;
        lastLng = currLng;
        accumulatedDist = 0;
      }
    }

    //ensure final point is included
    const [endLat, endLng] = path[path.length - 1];
    const [lastPtLat, lastPtLng] = points[points.length - 1];
    const distToEnd = Math.sqrt(
      Math.pow(endLat - lastPtLat, 2) + Math.pow(endLng - lastPtLng, 2)
    );
    if (distToEnd > 0.00001) {
      points.push([endLat, endLng]);
    }

    return points;
  }


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
      // Add safety checks
      if (!originRef.current) return;

      if (place && place.geometry) {
        setOrigin({
          //doing it this way ensures that if no geometry exists, default to 0
          lat: place.geometry.location?.lat() ?? 0,
          lng: place.geometry.location?.lng() ?? 0,
        });
        // Only try to access value if we're sure the ref exists
        setOrigin_string(originRef.current.value || "");
        setOriginValid(true); //this ensures that origin is valid when checking in trigger search
      }
      else {
        setOriginValid(false); //Not a valid entry so false
      }
    });

    destAutocomplete.addListener("place_changed", () => {
      const place = destAutocomplete.getPlace();
      // Add safety checks
      if (!destRef.current) return;

      if (place && place.geometry) {
        setDest({
          //doing it this way ensures that if no geometry exists, default to 0
          lat: place.geometry.location?.lat() ?? 0,
          lng: place.geometry.location?.lng() ?? 0,
        });
        // Only try to access value if we're sure the ref exists
        setDestination_string(destRef.current.value || "");
        setDestinationValid(true); //this ensures that destination is valid when checking in trigger search
      }
      else {
        setDestinationValid(false); //again, if false then invalid
      }
    });

    // any typing or erasing after selecting flips the state back to false because it would be invalid
    originRef.current.addEventListener("input", () => setOriginValid(false));
    destRef.current.addEventListener("input", () => setDestinationValid(false));

  };


  const triggerSearch = () => {

    //Determine if search is valid
    if (originValid && destinationValid) {
      console.log("Triggered Search");
      console.log("Origin: " + origin_string);
      console.log("Destination: " + destination_string);
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
    }
    else {
      //alert("Please input valid origin and destination fields");
    }
  };

  ///
  /// THE GOOGLE MAP LOGIC ENDS 
  ///

  return (
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

      travelMode={travelMode}
      setTravelMode={setTravelMode}

      mapRef={mapRef}
      originRef={originRef}
      destRef={destRef}

      sortMethod={sortMethod}
      setSortMethod={setSortMethod}

      selectedPlaceName={selectedPlaceName}
      setSelectedPlaceName={setSelectedPlaceName}
    />
  );

}

export default HomeContainer;

