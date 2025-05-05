myFinalPlaces.forEach((place) => {
  if (place.location) {
    const marker = new google.maps.Marker({
      position: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
      map: map,
      title: place.displayName?.text || 'Unnamed Place',
    });

    const infoWindow = new google.maps.InfoWindow();

    marker.addListener('click', () => {
      const firstPhoto = place.photos?.[0];
      const photoName = firstPhoto?.name;

      if (photoName) {
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${googleMapsAPIKey}`;

        const img = new Image();
        img.onload = () => {
          const infoContent = `
            <div style="max-width: 300px;">
              <h3>${place.displayName?.text || 'Unnamed Place'}</h3>
              <img src="${photoUrl}" alt="Place Photo" style="width: 100%; height: auto;" />
              <p>${place.formattedAddress || ''}</p>
            </div>
          `;
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
        };
        img.onerror = () => {
          const infoContent = `
            <div style="max-width: 300px;">
              <h3>${place.displayName?.text || 'Unnamed Place'}</h3>
              <p>No photo available.</p>
              <p>${place.formattedAddress || ''}</p>
            </div>
          `;
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
        };
        img.src = photoUrl;
      } else {
        const infoContent = `
          <div style="max-width: 300px;">
            <h3>${place.displayName?.text || 'Unnamed Place'}</h3>
            <p>No photo available.</p>
            <p>${place.formattedAddress || ''}</p>
          </div>
        `;
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
      }
    });
  }
});
