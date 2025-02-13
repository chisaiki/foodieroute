// Fetch API key from the server
fetch('/api-key')
    .then(response => response.json())
    .then(data => {
        if (!data.apiKey) throw new Error("API Key not received");

        // Dynamically add Google Maps script with the fetched API key
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);
    })
    .catch(error => console.error("Error fetching API key:", error));

function initMap() {
    //allows for customized maps! 
    // let mapTypeStylesArr = [
    //     {
    //         featureType: '',
    //         elementType: '',
    //         stylers: {
    //             color: '#FFFFFF'
    //         }
    //     }
    // ];


    // zoom ranges between 1 to 20
    //1 is most zoomed out, 20 is most zoommed in
    let mapOptions = {
        //stylers: mapTypeStylesArr,
        center: { lat: 40.768538, lng: -73.964741 }, // Hunter College
        zoom: 15,
        // mapId: 'CUSTOM_MAP_ID_HERE'
        //The options below allow me to restrict or enable
        //certain map types
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
        }
    };
    // There exists four different types of maps:
    // Road map, satellite, hybrid, terrain
    //This can be changed through the mapTypeID property
    //map.setMapTypeId('roadmap');

    //we can tilt the map however we wish
    //must be zoomed out 12 or more, and in satellite or hybrid maptypes
    //map.setTilt(45);

    // let map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // let markerOptions = {
    //     position: new google.maps.LatLng(40.768538, -73.964741),
    // }
    // let marker = new google.maps.Marker(markerOptions);
    // marker.setMap(map);


    //disappears after 3 seconds
    // setTimeout(() => {
    //     marker.setMap(null);
    // }, 3000);
    let map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
