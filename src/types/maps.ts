// Google Maps API Type Definitions

export interface GoogleMapsConfig {
  apiKey: string;
  mapId?: string;
  libraries?: Array<string>;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  phoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  types?: Array<string>;
  businessStatus?: string;
  openingHours?: {
    openNow?: boolean;
    weekdayText?: Array<string>;
  };
  photos?: Array<{
    name: string;
    widthPx?: number;
    heightPx?: number;
  }>;
}

export interface NearbySearchResponse {
  places: Array<PlaceDetails>;
  nextPageToken?: string;
}

export interface TextSearchResponse {
  places: Array<PlaceDetails>;
  nextPageToken?: string;
}
