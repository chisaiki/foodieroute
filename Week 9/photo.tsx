myFinalPlaces.forEach((place) => {
  const firstPhoto = place.photos?.[0];
  const photoName = firstPhoto?.name;

  const photoUrl = photoName
    ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${googleMapsAPIKey}`
    : null;

  if (place.location) {
    const marker = new google.maps.Marker({
      position: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
      map: map,
      title: place.displayName?.text || 'Unnamed Place',
    });

    const infoContent = `
      <div style="max-width: 300px;">
        <h3>${place.displayName?.text || 'Unnamed Place'}</h3>
        ${photoUrl ? `<img src="${photoUrl}" alt="Place Photo" style="width: 100%; height: auto;" />` : '<p>No photo available.</p>'}
        <p>${place.formattedAddress || ''}</p>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
});     