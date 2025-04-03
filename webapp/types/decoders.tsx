import { Place } from "./types";


export function decodePlaces(apiResponse: any[]): Place[] {
    return apiResponse.map((item) => {
      const location = item.location || item.geometry?.location;
  
      return {
        displayName: item.displayName ?? { text: item.name ?? "Unknown" },
        location: location
          ? {
              latitude: location.latitude ?? location.lat ?? 0,
              longitude: location.longitude ?? location.lng ?? 0,
            }
          : undefined,
        photos: [], //no photos for now//item.photos ?? [],
        rating: item.rating ?? undefined,
        priceLevel: item.priceLevel ?? "PRICE_LEVEL_UNSPECIFIED",
        formattedAddress: item.formattedAddress ?? item.address ?? "Unknown",
        userRatingCount: item.userRatingCount ?? item.user_ratings_total ?? 0,
        editorialSummary: item.editorialSummary ?? undefined,
      };
    });
}