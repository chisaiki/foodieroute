
// Places is not used anymore
export type Places = {
  name: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  rating?: number;
  priceLevel?: number;
  address?: string;
  userRatingsTotal?: number;
  summary?: string;
};




export type PriceLevel = "PRICE_LEVEL_FREE" | "PRICE_LEVEL_INEXPENSIVE" | "PRICE_LEVEL_MODERATE" | "PRICE_LEVEL_EXPENSIVE" | "PRICE_LEVEL_VERY_EXPENSIVE" | "PRICE_LEVEL_UNSPECIFIED";

export type  Place = {
  displayName?: { text: string };
  location?: { latitude: number; longitude: number };
  photos?: { name: string }[];
  rating?: number;
  priceLevel: PriceLevel;
  formattedAddress?: string;
  userRatingCount?: number;
  editorialSummary?: { text: string };
}
