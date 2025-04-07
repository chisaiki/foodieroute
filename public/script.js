let map;
let mapOptions;
let ORIGIN;
let DESTINATION;
let TRAVEL_MODE;
let SEARCH_QUERY;
let RADIUS;
let API_KEY = '';
let REDUCTION_CONSTANT = 50;
let SORT_METHOD;
//new global variables for search event listener
let ISORIGINDEFINED;
let ISDESTINATIONDEFINED;
let ISSEARCHDEFINED;
let  getCurrentLocation = false;

//to keep track of directions, globally
let CURRENTDIRECTIONSRENDERER = null;
//to keep track of markers shown, globally
let MARKERSCONTAINER = [];
//to keep track of rectangles shown, globally
let RECTANGLESCONTAINER = [];
//to keep track of intermediate waypoints
let BLUEDOTSCONTAINER = [];
// fetch the API key from the server
fetch('/api-key')
    .then(response => response.json())
    .then(data => {
        API_KEY = data.apiKey;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&callback=main`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    })
    .catch(error => {
        console.error('Error fetching API key:', error);
    });


const clearMap = () => {
    //Check if directions are in place. If so, clear them
    if (CURRENTDIRECTIONSRENDERER) {
        CURRENTDIRECTIONSRENDERER.setMap(null);
        CURRENTDIRECTIONSRENDERER = null;
    }

    //Clear all containers
    clearContainerHelper(MARKERSCONTAINER);
    clearContainerHelper(RECTANGLESCONTAINER);
    clearContainerHelper(BLUEDOTSCONTAINER);
}

//helper function that simplifies erasure process
const clearContainerHelper = (container) => {
    container.forEach((item) => { item.setMap(null) });
    //Make the container empty so that its size is maintainable
    container = [];
}

async function search_route() {

    //This function will clear the map display before beginning the search
    //This clear will get red of any data contained within the last
    //route that was outputted, such as markers.
    clearMap();

    let places_array = [];
    let directionsService = new google.maps.DirectionsService();
    //Since we need directions at times, store this value in global variable so that clearing is functional
    CURRENTDIRECTIONSRENDERER = new google.maps.DirectionsRenderer({
        map: map,
    });

    const request = {
        origin: ORIGIN,
        destination: DESTINATION,
        travelMode: TRAVEL_MODE
    };

    directionsService.route(request, async (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            //directionsRender is now a global variable, and contains the current directions
            CURRENTDIRECTIONSRENDERER.setDirections(response);
            const encodedPolyline = response.routes[0].overview_polyline;
            const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);

            let coords = [];
            decodedPath.forEach((point) => {
                coords.push([point.lat(), point.lng()]);
            });

            let reduced_coords = reduceCoordinates(coords); // reduceCoordinates is the algorithm
            console.log(reduced_coords);
            let midpoints = getCircleCenters(reduced_coords);
            console.log(midpoints);

            for (let j = 0; j < midpoints.length; j++) {
                let POINT = { lat: midpoints[j][0], lng: midpoints[j][1] };

                // Add a marker for each point
                let blueMarker = new google.maps.Marker({
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
                BLUEDOTSCONTAINER.push(blueMarker); //Append to global container so that it may removed later if needed.

                // Fetch nearby places and wait for it to finish before continuing
                const newPlaces = await fetchNearbyPlaces(POINT);
                places_array = places_array.concat(newPlaces);
            }
            //console.log(places_array);
            places_array = removeDuplicates(places_array);
            show_places(places_array);

        } else {
            console.error("Error with Directions API:", status);
        }
    });
}

// Function to remove duplicates based on the `displayName.text`
function removeDuplicates(places_array) {
    // Use a Set to track unique dsisplayName.text values
    const uniquePlaces = [];
    //data structure set for unique elements
    const seenKeys = new Set();

    //pushes everything into a set using their name

    places_array.forEach((place) => {
        //Let us utilize the key value pair relationship seen in sets
        //A given place has a unique key based on their name and coordinates
        const key = `${place.displayName.text}-${place.location.latitude}-${place.location.longitude}`;
        // Check if the place name has been seen before
        if (!seenKeys.has(key)) {
            uniquePlaces.push(place);
            seenKeys.add(key);
        }
    });

    return uniquePlaces;
}



function sortPlacesByRating(places_array) {
    return places_array.sort((a, b) => b.rating - a.rating);
}

//Some prices are missing
function sortPlacesByPriceLevel(places_array) {
    //https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
    const priceLevelOrder = {
        "PRICE_LEVEL_FREE": 1,
        "PRICE_LEVEL_INEXPENSIVE": 2,
        "PRICE_LEVEL_MODERATE": 3,
        "PRICE_LEVEL_EXPENSIVE": 4,
        "PRICE_LEVEL_VERY_EXPENSIVE": 5, // Adjust if necessary
        "PRICE_LEVEL_UNSPECIFIED": 6,

    };

    return places_array.sort((a, b) => priceLevelOrder[a.priceLevel] - priceLevelOrder[b.priceLevel]);
}

function sortPlacesByUserRatingCount(places_array) {
    return places_array.sort((a, b) => b.userRatingCount - a.userRatingCount);
}

function createMarker(place, map, index) {
    // Set the default size for the markers
    let markerSize = Math.max(6, 16 - index); // Gradually make markers smaller as index increases

    // After top 10 places, use a small red dot
    if (index > 9) {
        markerSize = 4; // Make the red dot even smaller
    }

    // Define the marker icon
    let markerIcon;

    if (index <= 9) {
        // Use a regular red marker for the top 10 places
        markerIcon = {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Regular red marker
            scaledSize: new google.maps.Size(markerSize * 2, markerSize * 2), // Adjust size based on index
            labelOrigin: new google.maps.Point(markerSize, markerSize), // Center the label
        };
    } else {
        // Use a smaller red dot for places after the top 10
        markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "red",
            fillOpacity: 1,
            strokeColor: "red",
            strokeOpacity: 1,
            strokeWeight: 1,
            scale: markerSize, // Use smaller size for red dots
        };
    }

    // Create the marker & return the marker
    return new google.maps.Marker({
        position: { lat: place.location.latitude, lng: place.location.longitude },
        map: map,
        icon: markerIcon,
        title: place.displayName.text, // Use place name as the title
    });
}

function show_places(places_array) {
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
    places_array.forEach((place, index) => {
        let marker = createMarker(place, map, index); // Create a marker for each place
        MARKERSCONTAINER.push(marker); //Store each marker in the global array of markers to keep track of them
    });
    console.log("Places have been sorted by SORT_METHOD:" + SORT_METHOD)
    console.log(places_array);
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

    // loop through all segments in reducedCoords
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

async function fetchNearbyPlaces(location) {
    let places_return = [];
    const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;

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

    const rectangle = new google.maps.Rectangle({
        map: map,
        bounds: bounds,
        fillColor: "#0000FF", // Semi-transparent blue
        fillOpacity: 0.1,
        strokeColor: "#0000FF", // Blue rectangle border
        strokeOpacity: 0.5,
        strokeWeight: 1
    });

    //Append each instance of a rectangle onto our container
    //So that our container globally contains all rectangles
    //So that we can clear when needed
    RECTANGLESCONTAINER.push(rectangle);

    const body = {
        "textQuery": SEARCH_QUERY,
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

        const data = await response.json();
        places_return = data.places || []; // Ensure places_return is populated with places from the response
    } catch (error) {
        console.error('Error during fetch:', error);
    }

    return places_return; // Return the places array after the fetch completes
}


let autocompleteListeningProcess = () => {
    const autocompleteStart = new google.maps.places.Autocomplete(document.querySelector('#start'));
    autocompleteStart.addListener('place_changed', () => {
        // Clear previous data
        clearMap();

        const place = autocompleteStart.getPlace();
        if (!place.geometry) {
            console.log("Origin does not exist");
            return;
        }

       //ON SUCCESS GO HERE AND STORE IT

        ORIGIN = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
        ISORIGINDEFINED = true;

        if (ISORIGINDEFINED && ISDESTINATIONDEFINED && ISSEARCHDEFINED) {
            search_route();
        }
        else
        alert("Please complete all fields to search.");
    });

    const autocompleteEnd = new google.maps.places.Autocomplete(document.querySelector('#end'));
    autocompleteEnd.addListener('place_changed', () => {
        // Clear previous data
        clearMap();

        const place = autocompleteEnd.getPlace();
        if (!place.geometry) {
            console.log("Destination does not exist");
            return;
        }

            DESTINATION = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };

            ISDESTINATIONDEFINED = true;
       

        if (ISORIGINDEFINED && ISDESTINATIONDEFINED && ISSEARCHDEFINED) {
            search_route();
        }
        else
        alert("Please complete all fields to search.");
    });

    const searchQuery = document.querySelector('#searchquery');
    //Listen for when user hits Enter button
    searchQuery.addEventListener('keyup', (e) => {
        //clearMap(); //No need to clear the map itself, in the case 
        //where the map is the same but the search is different

        //Update SEARCH_QUERY if Enter was pressed
        if (e.key === 'Enter') {
            SEARCH_QUERY = searchQuery.value;
            ISSEARCHDEFINED = true;
            if (SEARCH_QUERY === "")
                ISSEARCHDEFINED = false;
            // If all fields are valid, trigger search_route()
            if (ISORIGINDEFINED && ISDESTINATIONDEFINED && ISSEARCHDEFINED) {
                search_route();
            }
            else
            alert("Please complete all fields to search.");
        }
    });

    const userSortOption = document.querySelector('#sort_method');

    //If the user wants to keep the route and search query but 
    //wants to select a different method
    userSortOption.addEventListener('change', () => {

        SORT_METHOD = userSortOption.value;
        if (ISORIGINDEFINED && ISDESTINATIONDEFINED && ISSEARCHDEFINED) {
            search_route();
        }
        else
        alert("Please complete all fields to search.");
    })
}

//SLIGHT MODIFICATION
function main() {

    TRAVEL_MODE = google.maps.TravelMode.DRIVING;
    //SEARCH_QUERY = "pizzo";
    RADIUS = 300;
    SORT_METHOD = "Rating"; // could be "Rating" or "Count"
    //Hunter College as default map display
    mapOptions = {
        center: { lat: 40.7687, lng: -73.9649 },
        zoom: 14,
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Call this function in main so that the listening takes place
    autocompleteListeningProcess();
}

// Also listen for clicks on the search button as a second option
const searchButton = document.querySelector('#search');
searchButton.addEventListener('click', () => {
    //get the element
    const searchQueryElement = document.querySelector('#searchquery');
    // Update the global search query and set it to true
    SEARCH_QUERY = searchQueryElement.value;

    if (SEARCH_QUERY === "") {
        ISSEARCHDEFINED = false;
        console.log("Enter a value");
        return;
    } else {
        ISSEARCHDEFINED = true;
    }

    // search_route is called once all variables are set
    if (ISORIGINDEFINED && ISDESTINATIONDEFINED && ISSEARCHDEFINED) {
        search_route();
    }
    else
        alert("Please complete all fields to search.");
});


/*If user clicks on origin search button, will ask user*/

/*Event waiting for button click*/

const startInput = document.querySelector('#start');
startInput.addEventListener("click", () => currentLocation('origin'));

const destinationInput = document.querySelector('#end');
destinationInput.addEventListener("click", () => currentLocation('destination'));

function currentLocation(type) {
    let text = "Use Current Location?";
  
    if (confirm(text)) {
      const showError = (error) => {
        alert("Error getting location: " + error.message);
      };
  
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      const success = (position) => {
          const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
          };
  
          if (type === 'origin') {
              ORIGIN = locationData;
              document.querySelector('#start').value = "Current Location";
              ISORIGINDEFINED = true;
          } else if (type === 'destination') {
          DESTINATION = locationData;
          document.querySelector('#end').value = "Current Location";
          ISDESTINATIONDEFINED = true;
          }
      };
  
      navigator.geolocation.getCurrentPosition(success, showError);
  
      getCurrentLocation = true;
    }
  }
  
///////////////////////////////////
