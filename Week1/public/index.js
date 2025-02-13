function initMap(apiKey) {
    let mapOptions = {
        center: { lat: 40.768538, lng: -73.964741 }, // Hunter College
        zoom: 15,
    };
    let map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

// Fetch the API key from the server
fetch('/api-key')
    .then(response => response.json())
    .then(data => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap`;
        document.body.appendChild(script);
    });
