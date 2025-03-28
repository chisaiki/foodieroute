
  // import "../styles/tailwindStyle.css"
  // import MapErrorView from "./MapError";
  import "../styles/tailwindStyle.css";
  import { useEffect, useRef, useState } from "react";
  import { Places } from "../../../types/types";

  // TypeScript setup
  declare global {
    interface Window {
      initMap: () => void;
    }
  }

  declare const google: any;

  interface MapViewProps {
    mapsapiKey: string;
    placesAPIKey: string;
    setPlaces: React.Dispatch<React.SetStateAction<Places[]>>;
    origin: { lat: number; lng: number };
  }

  export default function MapView({ mapsapiKey, placesAPIKey, setPlaces, origin }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ORIGIN = { lat: origin.lat, lng: origin.lng };
    const DESTINATION = { lat: 40.7505, lng: -73.9934 };
    const TRAVEL_MODE = "DRIVING";
    const RADIUS = 200;
    const REDUCTION_CONSTANT = 50;

    useEffect(() => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsapiKey}&libraries=places,geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.initMap = () => {
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: ORIGIN,
          zoom: 15,
        });

        // searchRoute(map);
      };

      window.addEventListener("error", (event) => {
        if (event.message.includes("Google Maps JavaScript API error")) {
          setError("Google Maps API Error: Invalid or unauthorized API key.");
        }
      });

      return () => {
        document.body.removeChild(script);
      };
    }, [mapsapiKey]);

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

            midpoints.forEach(([lat, lng]) => {
              const point = { lat, lng };

              new google.maps.Marker({
                position: point,
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

              new google.maps.Circle({
                map,
                center: point,
                radius: RADIUS,
                fillColor: "#0000FF",
                fillOpacity: 0.1,
                strokeColor: "#0000FF",
                strokeOpacity: 0.5,
                strokeWeight: 1,
              });

              fetchNearbyPlaces(point, map);
            });
          } else {
            console.error("Error with Directions API:", status);
          }
        }
      );
    };

    const fetchNearbyPlaces = (location: { lat: number; lng: number }, map: any) => {
      const url = `https://places.googleapis.com/v1/places:searchNearby?key=${placesAPIKey}`;
      const body = {
        locationRestriction: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng,
            },
            radius: RADIUS,
          },
        },
        includedTypes: ["restaurant"],
      };

      fetch(url, {
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
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.places) {
            // console.log(data);
            data.places.forEach((place: any) => {
              // The Markers
              if (place.location?.latitude && place.location?.longitude) {
                new google.maps.Marker({
                  position: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                  },
                  map,
                  title: place.displayName?.text,
                });


              // The data
              const photoName: string = place.photos?.[0]?.name;
              const imageUrl = photoName
                ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${placesAPIKey}`
                : undefined;
              
              const placeObject: Places = {
                name: place.displayName?.text ?? "Unknown",
                latitude: place.location.latitude,
                longitude: place.location.longitude,
                photoUrl: imageUrl,
                rating: place.rating,
                priceLevel: place.priceLevel,
                address: place.formattedAddress,
                userRatingsTotal: place.userRatingCount,
                summary: place.editorialSummary?.text,
              };
              
              // Honestly this was chat gpt
              setPlaces(prev => {
                const exists = prev.some(p =>
                  p.name === placeObject.name &&
                  p.latitude === placeObject.latitude &&
                  p.longitude === placeObject.longitude
                );
                console.log(prev) // I just have to make sure it works onces

                return exists ? prev : [...prev, placeObject];
              });

              }
            });
          }
        })
        .catch((err) => console.error("Error fetching places:", err));
    };

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

    if (error) {
      return (
        <div className="text-red-500 text-center p-4 bg-gray-100">
          <h2>⚠️ Google Maps Error</h2>
          <p>{error}</p>
        </div>
      );
    }

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
  }