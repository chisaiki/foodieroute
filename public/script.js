let map;
let directionsService;
let directionsRenderer;

function initMap() {
    const ORIGIN = { lat: 40.7648, lng: -73.9654 }; // Hunter College
    const DESTINATION = { lat: 40.7505, lng: -73.9934 }; // Penn Station
    const SEARCH_QUERY = "Pizza";
    const RADIUS = 0.01;

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: ORIGIN,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
    });

    // Initialize PlacesService
    const service = new google.maps.places.PlacesService(map);

    const request = {
        origin: ORIGIN,
        destination: DESTINATION,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // Log the full response for debugging
            console.log("Directions Response:", response);

            // Get the encoded polyline
            const encodedPolyline = response.routes[0].overview_polyline;
            console.log("Encoded Polyline:", encodedPolyline);

            // Decode polyline
            const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
            console.log(decodedPath)
            let coords = [];
            // Place blue markers along the route
            // these markers are the coordinates to make the places API calls from
            decodedPath.forEach((point, index) => {
                coords.push([point.lat(), point.lng()]);
                new google.maps.Marker({
                    position: point,
                    map: map,
                    title: `Point ${index + 1} (Lat: ${point.lat()}, Lng: ${point.lng()})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "blue", // Blue color for the marker
                        fillOpacity: 1,
                        strokeColor: "blue",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        scale: 6,
                    },
                });
            });

            console.log(coords);

            // make calls to search along route here

        } else {
            console.error("Error with Directions API:", status);
        }
    });
}