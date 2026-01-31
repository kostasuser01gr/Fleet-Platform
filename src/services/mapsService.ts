// Google Maps API Service (Server-Side Proxy)
// Note: In production, these endpoints should be server-side only
// For now, we'll create a service that can be proxied through Vite

import { APIService } from './apiService';
import type {
  NearbySearchParams,
  RoutesETAParams,
  RoutesETAResult,
  PlaceDetails,
  NearbySearchResponse,
  TextSearchResponse,
} from '../types/maps';
import type { GeoLocation } from '../types/partsRadar';

class MapsService {
  private static readonly API_BASE = '/api/maps';

  /**
   * Places API (New) - Nearby Search
   * POST /api/maps/places/nearby
   */
  static async searchNearby(params: NearbySearchParams): Promise<NearbySearchResponse> {
    try {
      const response = await APIService.post<NearbySearchResponse>(
        `${this.API_BASE}/places/nearby`,
        params,
        { skipAuth: false } // Requires auth for rate limiting
      );
      return response;
    } catch (error) {
      console.error('Nearby search failed:', error);
      // Return empty result on error
      return { places: [] };
    }
  }

  /**
   * Places API (New) - Place Details
   * POST /api/maps/places/details
   */
  static async getPlaceDetails(placeId: string, fields?: Array<string>): Promise<PlaceDetails | null> {
    try {
      const response = await APIService.post<PlaceDetails>(
        `${this.API_BASE}/places/details`,
        { placeId, fields },
        { skipAuth: false }
      );
      return response;
    } catch (error) {
      console.error('Place details failed:', error);
      return null;
    }
  }

  /**
   * Places API (New) - Text Search (optional)
   * POST /api/maps/places/textsearch
   */
  static async textSearch(query: string, location?: GeoLocation, radius?: number): Promise<TextSearchResponse> {
    try {
      const response = await APIService.post<TextSearchResponse>(
        `${this.API_BASE}/places/textsearch`,
        { query, location, radius },
        { skipAuth: false }
      );
      return response;
    } catch (error) {
      console.error('Text search failed:', error);
      return { places: [] };
    }
  }

  /**
   * Routes API - Compute Routes (ETA)
   * POST /api/maps/routes/eta
   */
  static async computeETA(params: RoutesETAParams): Promise<RoutesETAResult | null> {
    try {
      // Check cache first (implemented in API service)
      const cacheKey = `eta_${params.origin.lat}_${params.origin.lng}_${params.destination.lat}_${params.destination.lng}`;
      
      const response = await APIService.post<RoutesETAResult>(
        `${this.API_BASE}/routes/eta`,
        params,
        {
          skipAuth: false,
          useCache: true,
          cacheTTL: 5 * 60 * 1000, // 5 minutes cache
        }
      );
      return response;
    } catch (error) {
      console.error('ETA computation failed:', error);
      return null;
    }
  }

  /**
   * Batch ETA computation for multiple destinations
   * Only computes top K to avoid cost spikes
   */
  static async computeBatchETA(
    origin: GeoLocation,
    destinations: Array<GeoLocation>,
    maxCount: number = 20
  ): Promise<Array<{ destination: GeoLocation; result: RoutesETAResult | null }>> {
    const topDestinations = destinations.slice(0, maxCount);
    
    const promises = topDestinations.map(async (destination) => ({
      destination,
      result: await this.computeETA({
        origin,
        destination,
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      }),
    }));

    return Promise.all(promises);
  }

  /**
   * Geocoding (if needed for address -> lat/lng)
   * POST /api/maps/geocode
   */
  static async geocodeAddress(address: string): Promise<GeoLocation | null> {
    try {
      const response = await APIService.post<{ location: GeoLocation }>(
        `${this.API_BASE}/geocode`,
        { address },
        { skipAuth: false }
      );
      return response.location;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }
}

export { MapsService };
