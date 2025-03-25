// THIS CODE WAS FETCHED FROM TOMO'S GITHUB REPOSITORY
//HIS CODE BEGINS HERE
let map;
let mapOptions;
let ORIGIN;
let DESTINATION;
let TRAVEL_MODE;
let SEARCH_QUERY;
let RADIUS;
let API_KEY = '';
let REDUCTION_CONSTANT = 50;

// fetch the API key from the server
fetch('/api-key')
    .then(response => response.json())
    .then(data => {
        API_KEY = data.apiKey;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=main`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    })
    .catch(error => {
        console.error('Error fetching API key:', error);
    });


function search_route() {
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
    });

    const request = {
        origin: ORIGIN,
        destination: DESTINATION,
        travelMode: TRAVEL_MODE
    };

    directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            const encodedPolyline = response.routes[0].overview_polyline;
            const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);

            let coords = [];
            decodedPath.forEach((point) => {
                coords.push([point.lat(), point.lng()]);
            });

            let reduced_coords = reduceCoordinates(coords); //reducedCoordinates is the algo
            console.log(reduced_coords);
            let midpoints = getCircleCenters(reduced_coords);
            console.log(midpoints);
            for (let j = 0; j < midpoints.length; j++) {
                let POINT = { lat: midpoints[j][0], lng: midpoints[j][1] };

                // add a marker for each point
                new google.maps.Marker({
                    position: POINT,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "blue",
                        fillOpacity: 1,
                        strokeColor: "blue",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        scale: 6,
                    }
                });

                // draw a transparent circle with the specified radius around each point
                new google.maps.Circle({
                    map: map,
                    center: POINT,
                    radius: RADIUS, // radius in meters
                    fillColor: "#0000FF",
                    fillOpacity: 0.1,
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.5,
                    strokeWeight: 1,
                });

                // API call for each coordinate
                fetchNearbyPlaces(POINT);
            }

        } else {
            console.error("Error with Directions API:", status);
        }
    });
}

// calculate the perpendicular distance from a point to a line formed by two points
function perpendicularDistance(px, py, x1, y1, x2, y2) {
    return Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
        Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}

// function to convert meters to degrees of latitude (approximate)
function metersToDegrees(meters) {
    const metersPerDegree = 111320;
    return meters / metersPerDegree;
}

// reduces the set of coordinates
function reduceCoordinates(coords) {
    const thresholdDistanceDeg = metersToDegrees(REDUCTION_CONSTANT);

    let i = 0;
    while (i < coords.length - 2) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        const [x3, y3] = coords[i + 2];

        const dist = perpendicularDistance(x2, y2, x1, y1, x3, y3);

        // if the distance is smaller than the threshold, remove the second point
        if (dist < thresholdDistanceDeg) {
            coords.splice(i + 1, 1); // remove the second point
        } else {
            // otherwise, make the second point the first point and continue
            i++;
        }
    }

    return coords;
}


function generatePointsAlongLine(x1, y1, x2, y2, radius = RADIUS) {
    // calculate the distance between the two points
    const lineDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // calculate the number of points such that the circles don't overlap
    const numPoints = Math.floor(lineDistance / (2 * radius));  // points spaced by 2 * radius

    // calculate direction vector along the line
    const dx = (x2 - x1) / lineDistance;
    const dy = (y2 - y1) / lineDistance;

    // generate new points along the line
    const newPoints = [];
    for (let i = 0; i <= numPoints; i++) {
        const newX = x1 + i * 2 * radius * dx;
        const newY = y1 + i * 2 * radius * dy;
        newPoints.push([newX, newY]);
    }

    return newPoints;
}

// function to generate all the points that will be the center of the circles along the path
function getCircleCenters(reducedCoords, radiusMeters = RADIUS) {
    const circleCenters = [];

    // convert the radius to degrees
    const radiusDegrees = metersToDegrees(radiusMeters);

    // ;oop through all segments in reducedCoords
    for (let i = 0; i < reducedCoords.length - 1; i++) {
        const [x1, y1] = reducedCoords[i];
        const [x2, y2] = reducedCoords[i + 1];

        // generate points along the line between (x1, y1) and (x2, y2)
        const newPoints = generatePointsAlongLine(x1, y1, x2, y2, radiusDegrees);

        // add the new points to the circle centers array
        circleCenters.push(...newPoints);
    }

    return circleCenters;
}


function fetchNearbyPlaces(location) {
    const url = `https://places.googleapis.com/v1/places:searchNearby?key=${API_KEY}`;

    const body = {
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": location.lat,
                    "longitude": location.lng
                },
                "radius": RADIUS
            }
        },
        "includedTypes": ["restaurant"], // search type
        //"maxResultCount": 3,
    };

    console.log('Request URL:', url);
    console.log('Request Body:', JSON.stringify(body));

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'places.displayName,places.location' // request the location field as well
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            if (data && data.places) {
                console.log('Places Found:', data.places);


                data.places.forEach(place => {
                    console.log('Place location:', place.location);
                    if (place.location && place.location.latitude && place.location.longitude) {
                        new google.maps.Marker({
                            position: {
                                lat: place.location.latitude,
                                lng: place.location.longitude
                            },
                            map: map,
                            title: place.displayName.text // use the place's display name as the title
                        });
                    } else {
                        console.log('Invalid location for place:', place);
                    }
                });
            } else {
                console.log('No places found or error in response:', data);
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
}
//HIS CODE ENDS HERE

//SLIGHT MODIFICATION
function main() {
    // Set default values for things other than ORIGIN/DESTINATION
    TRAVEL_MODE = google.maps.TravelMode.DRIVING;
    SEARCH_QUERY = "Pizza";
    RADIUS = 200;

    // Set up the map with a default center (neutral starting point)
    mapOptions = {
        center: { lat: 40.758, lng: -73.9855 }, // Times Square
        zoom: 14,
    };

    map = new google.maps.Map(document.querySelector("map"), mapOptions);

    // Initialize the autocomplete fields and handle routing once both are selected
    setupAutocomplete();
}

//MY AUTOCOMPLETE INTEGRATION WITH TOMO'S UPDATED MAP CODE
function autocompleteImplementation() {

    // Ensure autocomplete retrieves the starting point and destination as inputs
    const autocompleteStart = new google.maps.places.Autocomplete(document.querySelector('start'));
    const autocompleteEnd = new google.maps.places.Autocomplete(document.querySelector('end'));

    //Since the origin and destination are not known until the user inputs them,
    //we create these boolean values to ensure that they are not yet defined at this point
    let isOriginDefined = false;
    let isDestinationDefined = false;

    //This listens for the moment a user selects a starting point
    autocompleteStart.addListener('place_changed', () => {
        const place = autocompleteStart.getPlace();

        //Place cannot be invalid, so if there's no geometry
        //then the place does not exist
        if (!place.geometry) {
            console.log("Origin does not exist");
            return;
        }

        // The place is valid, thus we assign its longitutde and latitude values
        // to the origin variable
        ORIGIN = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        isOriginDefined = true;
        //console.log("Origin valid: ", ORIGIN);

        // Route will be drawn once both points are defined 
        if (isOriginDefined && isDestinationDefined) {
            search_route();
        }
    });

    //This listens for the moment a user selects a destination
    autocompleteEnd.addListener('place_changed', () => {
        const place = autocompleteEnd.getPlace();

        //Place cannot be invalid, so if there's no geometry
        //then the place does not exist
        if (!place.geometry) {
            //for debugging purposes
            console.log("Destination does not exist");
            return;
        }

        // The place is valid, thus we assign its longitutde and latitude values
        // to the destination variable
        DESTINATION = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        isDestinationDefined = true;
        // console.log("Destination valid: ", DESTINATION);

        // Route will be drawn once both points are defined 
        if (isOriginDefined && isDestinationDefined) {
            search_route();
        }
    });
}