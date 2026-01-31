// Google Maps Component with Markers and Clustering

import React, { useState, useMemo, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import type { CustomPartner, PartnerFilters } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Phone, Globe, Star } from 'lucide-react';

interface PartnerMapProps {
  center: { lat: number; lng: number };
  partners: CustomPartner[];
  selectedPartner: CustomPartner | null;
  onPartnerSelect: (partner: CustomPartner) => void;
  filters?: PartnerFilters;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export function PartnerMap({
  center,
  partners,
  selectedPartner,
  onPartnerSelect,
  filters,
}: PartnerMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'geometry'],
  });

  const getMarkerIcon = useCallback((partner: CustomPartner): string => {
    // Different colors for custom vs places, tier, online status
    if (partner.source === 'custom' && partner.isVerified) {
      return partner.isOnline
        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    } else if (partner.source === 'google_places') {
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
    return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  }, []);

  const [infoWindowPartner, setInfoWindowPartner] = useState<CustomPartner | null>(null);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center p-4">
          <p className="font-semibold mb-2">Google Maps API Key Required</p>
          <p className="text-sm">Please configure VITE_GOOGLE_MAPS_API_KEY in your environment variables.</p>
          <p className="text-xs mt-2 text-gray-500">See docs/maps-setup.md for setup instructions.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <p>Error loading Google Maps</p>
          <p className="text-sm mt-2">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      options={{
        ...defaultOptions,
        mapId: mapId,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#242424' }],
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242424' }],
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }],
          },
        ],
      }}
    >
      {partners.map((partner: CustomPartner): React.JSX.Element => (
        <Marker
          key={partner.partnerId}
          position={partner.geo}
          icon={getMarkerIcon(partner)}
          onClick={(): void => {
            setInfoWindowPartner(partner);
            onPartnerSelect(partner);
          }}
        />
      ))}

      {infoWindowPartner && (
        <InfoWindow
          position={infoWindowPartner.geo}
          onCloseClick={(): void => setInfoWindowPartner(null)}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-1">{infoWindowPartner.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{infoWindowPartner.address}</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={infoWindowPartner.tier === 'premium' ? 'default' : 'secondary'}>
                {infoWindowPartner.tier}
              </Badge>
              {infoWindowPartner.isOnline && (
                <Badge className="bg-green-500/20 text-green-600 text-xs">Online</Badge>
              )}
            </div>
            <div className="flex gap-2 text-xs text-gray-600">
              {infoWindowPartner.phone && (
                <a href={`tel:${infoWindowPartner.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              )}
              {infoWindowPartner.website && (
                <a href={infoWindowPartner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                  <Globe className="w-3 h-3" />
                  Website
                </a>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
