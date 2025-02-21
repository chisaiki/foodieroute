// Fetch API key from the correct server when using Live Server
fetch('http://localhost:8000/api-key')
    .then(response => response.json())
    .then(data => {
        if (!data.apiKey) throw new Error("API Key not received");

        // Dynamically add Google Maps script with the fetched API key
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);
    })
    .catch(error => console.error("Error fetching API key:", error));


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

    // Initialize autocomplete for both input fields
    const autocompleteStart = new google.maps.places.Autocomplete(
        document.getElementById('start')
    );
    const autocompleteEnd = new google.maps.places.Autocomplete(
        document.getElementById('end')
    );

    // Trigger route calculation when a place is selected
    autocompleteStart.addListener('place_changed', calculateRoute);
    autocompleteEnd.addListener('place_changed', calculateRoute);

    function calculateRoute() {
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;

        if (start && end) {
            const request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        }
    }

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
